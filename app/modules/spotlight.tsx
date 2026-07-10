import type { SpotlightActionData } from '@mantine/spotlight';
import { BiSolidLock } from 'react-icons/bi';
import { FaUsersCog } from 'react-icons/fa';
import { HiMiniHome, HiUser } from 'react-icons/hi2';
import { MdSpaceDashboard } from 'react-icons/md';
import { PiCoinsFill, PiHandCoinsFill } from 'react-icons/pi';
import { TbApiApp } from 'react-icons/tb';

export const dashboardSpotlight: SpotlightActionData[] = [
	{
		id: '/dashboard',
		label: 'Dashboard',
		description:
			'Manage your account, recent activity, and access important features more quickly through the dashboard',
		leftSection: <MdSpaceDashboard size={24} />,
	},
	{
		id: '/dashboard/usage',
		label: 'Penggunaan Token',
		description: 'Lihat jumlah token yang telah digunakan, sisa token, dan riwayat penggunaan',
		leftSection: <PiCoinsFill size={24} />,
	},
	{
		id: '/dashboard/topup',
		label: 'Topup Token',
		description:
			'Tambahkan token ke akun Anda agar tetap dapat menggunakan fitur AI dan layanan lainnya',
		leftSection: <PiHandCoinsFill size={24} />,
	},
	{
		id: '/dashboard/users',
		label: 'Profile',
		description:
			'Manage your profile details, update personal information, and customize your account preferences',
		leftSection: <HiUser size={24} />,
	},
	{
		id: '/dashboard/change-password',
		label: 'Change Password',
		description:
			'Update your password to keep your account secure and protect your personal information',
		leftSection: <BiSolidLock size={24} />,
	},
];

export const staffSpotlight: SpotlightActionData[] = [
	{
		id: '/admin',
		label: 'Admin',
		description: 'Get full information about current system status',
		leftSection: <HiMiniHome size={24} />,
	},
	{
		id: '/admin/apps',
		label: 'Manage Apps',
		description: 'Manage karsakito apps',
		leftSection: <TbApiApp size={24} />,
	},
	...dashboardSpotlight,
];

export const adminSpotlight: SpotlightActionData[] = [
	{
		id: '/admin/users',
		label: 'Manage Users',
		description: 'Manage users, roles, and permissions',
		leftSection: <FaUsersCog size={24} />,
	},
	...staffSpotlight,
];
