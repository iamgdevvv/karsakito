import { PrismaD1 } from '@prisma/adapter-d1';
import { createContext, createRequestHandler, RouterContextProvider } from 'react-router';
import { amountTokenDaily } from '~app-modules/enum-options';
import { dayjs } from '~app-modules/utils';
import { PrismaClient } from '~generated/prisma/client';

export const prismaContext = createContext<PrismaClient>();

export const cloudflareContext = createContext<{
	env: Env;
	ctx: ExecutionContext;
}>();

export type PrismaContext = typeof prismaContext;
export type CloudflareContext = typeof cloudflareContext;

const requestHandler = createRequestHandler(
	() => import('virtual:react-router/server-build'),
	import.meta.env.MODE,
);

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		const adapter = new PrismaD1(env.DB);
		const prisma = new PrismaClient({ adapter });

		const context = new RouterContextProvider();

		context.set(prismaContext, prisma);
		context.set(cloudflareContext, {
			env,
			ctx,
		});

		if (
			(url.pathname.includes('/__scheduled') ||
				url.pathname.includes('/cdn-cgi/handler/scheduled')) &&
			this.scheduled
		) {
			// Manually execute the scheduled function
			await this.scheduled(
				{
					cron: 'local-test',
					scheduledTime: Date.now(),
					noRetry: function (): void {
						throw new Error('Function not implemented.');
					},
				},
				env,
				ctx,
			);
			return new Response('Local cron executed manually');
		}

		return requestHandler(request, context);
	},

	async scheduled(controller, env, ctx) {
		if (env.NODE_ENV !== 'production') {
			return;
		}

		const scheduledDate = dayjs(controller.scheduledTime);
		const now = scheduledDate.utc();

		console.log(`Cron refill tokenDaily processed at ${now.toISOString()}`);

		const adapter = new PrismaD1(env.DB);
		const prisma = new PrismaClient({ adapter });

		const refillToken = async () => {
			try {
				const uniqueTimezones = await prisma.user.findMany({
					select: { timezone: true },
					distinct: ['timezone'],
				});

				const targetTimezones = uniqueTimezones
					.map((u) => u.timezone)
					.filter((tz) => {
						try {
							return scheduledDate.tz(tz).hour() === 0;
						} catch (e) {
							console.error(`Invalid timezone in DB: ${tz}`, e);
							return false;
						}
					});

				if (targetTimezones.length === 0) {
					console.log('Tidak ada timezone yang sedang tengah malam. Skip refill.');
					return;
				}

				const targetUsers = await prisma.user.findMany({
					where: {
						timezone: {
							in: targetTimezones,
						},
						balances: {
							tokenDaily: {
								lt: amountTokenDaily,
							},
						},
					},
					select: {
						id: true,
						balances: {
							select: {
								tokenDaily: true,
							},
						},
					},
				});

				const transactions = [];

				for (const user of targetUsers) {
					const balance = user.balances;

					if (!balance) continue;

					const addedDailyToken = amountTokenDaily - balance.tokenDaily;

					const updateBalance = prisma.balance.update({
						where: {
							userId: user.id,
						},
						data: {
							tokenDaily: amountTokenDaily,
							activities: {
								create: {
									type: 'DAILY_BONUS',
									token: addedDailyToken,
									tokenDailyBefore: balance.tokenDaily,
									tokenDailyAfter: amountTokenDaily,
								},
							},
						},
					});

					transactions.push(updateBalance);
				}

				// PENTING: Cloudflare D1 memiliki batas limit statement per transaksi (biasanya ~1000).
				// Jika data sangat besar, lakukan pemotongan chunk per 100 user (200 query).
				if (transactions.length) {
					const CHUNK_SIZE = 100;
					for (let i = 0; i < transactions.length; i += CHUNK_SIZE) {
						const chunk = transactions.slice(i, i + CHUNK_SIZE);
						await prisma.$transaction(chunk);
					}
				}

				console.log(
					`Berhasil melakukan refill daily token untuk ${transactions.length} users.`,
				);
			} catch (error) {
				console.error('Error saat menjalankan refillToken:', error);
			}
		};

		ctx.waitUntil(refillToken());
	},
} satisfies ExportedHandler<Env>;
