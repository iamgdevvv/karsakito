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
		description: 'Kelola akun, pantau aktivitas terbaru, dan buka fitur penting.',
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
		label: 'Profil',
		description: 'Perbarui informasi dan pengaturan akun Anda.',
		leftSection: <HiUser size={24} />,
	},
	{
		id: '/dashboard/change-password',
		label: 'Ubah kata sandi',
		description: 'Perbarui kata sandi untuk menjaga akses akun Anda.',
		leftSection: <BiSolidLock size={24} />,
	},
];

export const staffSpotlight: SpotlightActionData[] = [
	{
		id: '/admin',
		label: 'Admin',
		description: 'Lihat informasi dan pengelolaan sistem.',
		leftSection: <HiMiniHome size={24} />,
	},
	{
		id: '/admin/apps',
		label: 'Kelola Aplikasi',
		description: 'Kelola Aplikasi KarsaKito.',
		leftSection: <TbApiApp size={24} />,
	},
	...dashboardSpotlight,
];

export const adminSpotlight: SpotlightActionData[] = [
	{
		id: '/admin/users',
		label: 'Kelola Pengguna',
		description: 'Kelola Pengguna, peran, dan akses.',
		leftSection: <FaUsersCog size={24} />,
	},
	...staffSpotlight,
];
