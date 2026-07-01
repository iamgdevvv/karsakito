import type { UserRole } from '~generated/prisma/enums';

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
