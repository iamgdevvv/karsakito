import type { UserRole } from '~generated/prisma/enums';

export enum Apps {
	karsawriter = 'KarsaWriter',
	karsalator = 'KarsaLator',
	karsalisa = 'KarsaLisa',
	karsafrase = 'KarsaFrase',
	karsapedia = 'KarsaPedia',
	karsalingo = 'KarsaLingo',
}

export enum AppsSoon {
	karsapedia = 'KarsaPedia',
	karsalingo = 'KarsaLingo',
}

export const optionsApps: {
	label: Apps;
	value: keyof typeof Apps;
	description: string;
}[] = [
	{
		label: Apps.karsawriter,
		value: 'karsawriter',
		description: 'Tulis konten dengan bantuan AI.',
	},
	{
		label: Apps.karsalator,
		value: 'karsalator',
		description: 'Terjemahkan bahasa asing atau bahasa Indonesia dan bahasa daerah',
	},
	{
		label: Apps.karsalisa,
		value: 'karsalisa',
		description: 'Analisis dokumen dan data dengan AI.',
	},
	{
		label: Apps.karsafrase,
		value: 'karsafrase',
		description: 'Parafrase dan perbaiki kalimat.',
	},
	{
		label: Apps.karsapedia,
		value: 'karsapedia',
		description: 'Dapatkan informasi seputar budaya dan bahasa daerah.',
	},
	{
		label: Apps.karsalingo,
		value: 'karsalingo',
		description: 'Belajar bahasa daerah dengan AI.',
	},
];

export const optionsUserRole: {
	label: string;
	value: UserRole;
}[] = [
	{
		label: 'Admin',
		value: 'ADMIN',
	},
	{
		label: 'Staff',
		value: 'STAFF',
	},
	{
		label: 'Customer',
		value: 'CUSTOMER',
	},
];
