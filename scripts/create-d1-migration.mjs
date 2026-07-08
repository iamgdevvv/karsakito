import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const migrationsDir = resolve(rootDir, 'prisma', 'migrations');
const prismaSchema = resolve(rootDir, 'prisma', 'schema.prisma');
const prismaBin = resolve(rootDir, 'node_modules', 'prisma', 'build', 'index.js');
const migrationName = process.argv[2];

if (!migrationName) {
	console.error('Usage: npm run db:migrate:create -- <migration_name>');
	process.exit(1);
}

if (!existsSync(migrationsDir)) {
	mkdirSync(migrationsDir, { recursive: true });
}

const lockFile = resolve(migrationsDir, 'migration_lock.toml');
if (!existsSync(lockFile)) {
	writeFileSync(lockFile, 'provider = "sqlite"\n', 'utf8');
}

const slug = migrationName
	.toLowerCase()
	.replace(/[^a-z0-9]+/g, '_')
	.replace(/^_+|_+$/g, '');

if (!slug) {
	console.error('Migration name must contain at least one letter or number.');
	process.exit(1);
}

const existingNumbers = readdirSync(migrationsDir, { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => /^(\d+)_/.exec(entry.name)?.[1])
	.filter(Boolean)
	.map(Number);

const nextNumber = String((existingNumbers.length ? Math.max(...existingNumbers) : 0) + 1).padStart(
	4,
	'0',
);
const migrationDir = resolve(migrationsDir, `${nextNumber}_${slug}`);
const migrationFile = resolve(migrationDir, 'migration.sql');

if (existsSync(migrationDir)) {
	console.error(`Migration directory already exists: ${migrationDir}`);
	process.exit(1);
}

const sql = execFileSync(
	process.execPath,
	[
		prismaBin,
		'migrate',
		'diff',
		'--from-migrations',
		migrationsDir,
		'--to-schema',
		prismaSchema,
		'--script',
	],
	{ cwd: rootDir, encoding: 'utf8' },
);

const executableSql = sql
	.split(/\r?\n/)
	.filter((line) => !line.trim().startsWith('--'))
	.join('\n')
	.trim();

if (!executableSql) {
	console.error('No schema changes detected. Migration was not created.');
	process.exit(1);
}

mkdirSync(migrationDir);
writeFileSync(migrationFile, `${sql.trim()}\n`, 'utf8');

try {
	execFileSync(
		process.execPath,
		[
			prismaBin,
			'migrate',
			'diff',
			'--from-migrations',
			migrationsDir,
			'--to-schema',
			prismaSchema,
			'--exit-code',
		],
		{ cwd: rootDir, stdio: 'pipe' },
	);
} catch (error) {
	rmSync(migrationDir, { recursive: true, force: true });
	if (error.stdout) {
		process.stdout.write(error.stdout);
	}
	if (error.stderr) {
		process.stderr.write(error.stderr);
	}
	throw error;
}

console.log(`Migration written to ${migrationFile}`);
