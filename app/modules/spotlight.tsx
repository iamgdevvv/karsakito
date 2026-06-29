import type { SpotlightActionData } from '@mantine/spotlight';
import { BiSolidLock } from 'react-icons/bi';
import { FaUsersCog } from 'react-icons/fa';
import { HiMiniHome, HiUser } from 'react-icons/hi2';
import { MdSpaceDashboard } from 'react-icons/md';

export const dashboardSpotlight: SpotlightActionData[] = [
	{
		id: 'dashboard',
		label: 'Dashboard',
		description:
			'Manage your account, recent activity, and access important features more quickly through the dashboard',
		leftSection: <MdSpaceDashboard size={24} />,
	},
	{
		id: 'dashboard/users',
		label: 'Profile',
		description:
			'Manage your profile details, update personal information, and customize your account preferences',
		leftSection: <HiUser size={24} />,
	},
	{
		id: 'dashboard/change-password',
		label: 'Change Password',
		description:
			'Update your password to keep your account secure and protect your personal information',
		leftSection: <BiSolidLock size={24} />,
	},
];

export const adminSpotlight: SpotlightActionData[] = [
	{
		id: 'admin',
		label: 'Admin',
		description: 'Get full information about current system status',
		leftSection: <HiMiniHome size={24} />,
	},
	{
		id: 'admin/users',
		label: 'Manage Users',
		description: 'Manage users, roles, and permissions',
		leftSection: <FaUsersCog size={24} />,
	},
	...dashboardSpotlight,
];
