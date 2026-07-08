import type { UserRole } from '~generated/prisma/enums';

export const amountTokenDaily = 10;

export enum Apps {
	karsawriter = 'karsawriter',
	karsalator = 'karsalator',
	karsalisa = 'karsalisa',
	karsafrase = 'karsafrase',
	karsapedia = 'karsapedia',
	karsalingo = 'karsalingo',
}

export const optionsApps: {
	label: string;
	value: keyof typeof Apps;
	disabled?: boolean;
	description: string;
}[] = [
	{
		label: 'KarsaWriter',
		value: 'karsawriter',
		description: 'Tulis konten dengan bantuan AI.',
	},
	{
		label: 'KarsaLator',
		value: 'karsalator',
		description: 'Terjemahkan bahasa asing atau bahasa Indonesia dan bahasa daerah',
	},
	{
		label: 'KarsaLisa',
		value: 'karsalisa',
		description: 'Analisis dokumen dan data dengan AI.',
	},
	{
		label: 'KarsaFrase',
		value: 'karsafrase',
		description: 'Parafrase dan perbaiki kalimat.',
	},
	{
		label: 'KarsaPedia',
		value: 'karsapedia',
		description: 'Dapatkan informasi seputar budaya dan bahasa daerah.',
		disabled: true,
	},
	{
		label: 'KarsaLingo',
		value: 'karsalingo',
		description: 'Belajar bahasa daerah dengan AI.',
		disabled: true,
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
