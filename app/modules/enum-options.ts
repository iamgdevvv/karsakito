import type { KarsaAppsCategory, UserRole } from '~generated/prisma/enums';

export const amountTokenDaily = 10;

export const labelAppCategory = {
	karsawriter: 'KarsaWriter',
	karsalator: 'KarsaLator',
	karsalisa: 'KarsaLisa',
	karsafrase: 'KarsaFrase',
	karsapedia: 'KarsaPedia',
} as const satisfies Record<KarsaAppsCategory, string>;

export const optionsAppCategory = Object.entries(labelAppCategory).map(([value, label]) => ({
	label,
	value,
}));

export const labelUserRole = {
	ADMIN: 'Admin',
	STAFF: 'Staff',
	CUSTOMER: 'Customer',
} as const satisfies Record<UserRole, string>;

export const optionsUserRole = Object.entries(labelUserRole).map(([value, label]) => ({
	label,
	value,
}));
