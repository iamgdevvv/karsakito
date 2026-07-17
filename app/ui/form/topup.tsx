import {
	Alert,
	Badge,
	Box,
	Button,
	Center,
	Group,
	Modal,
	Stack,
	Text,
	TextInput,
	ThemeIcon,
	type BoxProps,
} from '@mantine/core';
import { useState } from 'react';
import { LuGift, LuSparkles, LuCrown, LuGem, LuPencil } from 'react-icons/lu';
import { PiHandCoinsFill, PiCoinsFill } from 'react-icons/pi';
import { cn } from '~app-modules/utils';

type TokenPackage = {
	id: string;
	token: number;
	price: number;
	label: string;
	description: string;
	icon: React.ReactNode;
	color: string;
	popular?: boolean;
};

// NOTE: Hanya mockup UI — fitur topup belum siap (button "Coming Soon").
// Harga & paket di bawah adalah placeholder, silakan disesuaikan kemudian.
const tokenPackages: TokenPackage[] = [
	{
		id: 'pkg-50',
		token: 50,
		price: 10000,
		label: 'Starter',
		description: 'Cocok untuk coba-coba',
		icon: <LuSparkles size={22} />,
		color: 'teal',
	},
	{
		id: 'pkg-100',
		token: 100,
		price: 18000,
		label: 'Basic',
		description: 'Paling laris untuk harian',
		icon: <LuGift size={22} />,
		color: 'grape',
		popular: true,
	},
	{
		id: 'pkg-200',
		token: 200,
		price: 35000,
		label: 'Plus',
		description: 'Lebih hemat untuk produktif',
		icon: <LuGem size={22} />,
		color: 'blue',
	},
	{
		id: 'pkg-500',
		token: 500,
		price: 80000,
		label: 'Pro',
		description: 'Untuk pengguna aktif',
		icon: <LuCrown size={22} />,
		color: 'orange',
	},
];

const CUSTOM_PACKAGE_ID = 'pkg-custom';
const MIN_CUSTOM_PRICE = 10000;
const CUSTOM_PRICE_STEP = 1000;

// NOTE: Mock rate token per rupiah (estimasi). Sesuaikan kemudian saat payment siap.
// Paket Basic: 100 token / Rp18.000 ≈ 1 token per Rp180 → dibulatkan jadi Rp200/token (mock).
const TOKEN_PER_RUPIAH = 1 / 200;

const formatPrice = (price: number) => {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
	}).format(price);
};

export default function FormTopup({ ...props }: BoxProps) {
	const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
	const [customPrice, setCustomPrice] = useState<string>('');
	const [customModalOpened, setCustomModalOpened] = useState(false);
	const selected = tokenPackages.find((p) => p.id === selectedPackage);
	const isCustom = selectedPackage === CUSTOM_PACKAGE_ID;

	// Validasi nominal custom: minimal Rp10.000 & kelipatan Rp1.000 (tanpa ratusan/puluhan).
	// Dihitung saat modal dibuka / user input — TIDAK bergantung isCustom (selectedPackage).
	const customPriceNumber = customPrice ? Number(customPrice) : 0;
	const hasInput = customPrice.trim() !== '';
	const customError = !hasInput
		? null
		: Number.isNaN(customPriceNumber) || customPriceNumber < MIN_CUSTOM_PRICE
			? `Minimal ${formatPrice(MIN_CUSTOM_PRICE)}`
			: customPriceNumber % CUSTOM_PRICE_STEP !== 0
				? `Harus kelipatan ${formatPrice(CUSTOM_PRICE_STEP)} (contoh: 10.000, 11.000)`
				: null;

	// Estimasi token dari nominal custom (mock rate).
	const estimatedToken = isCustom && !customError ? Math.floor(customPriceNumber * TOKEN_PER_RUPIAH) : 0;

	// Ringkasan dipakai bersama: paket tetap atau custom.
	const summary = isCustom
		? customError
			? null
			: {
					label: 'Custom',
					token: estimatedToken,
					price: customPriceNumber,
				}
		: selected
			? { label: selected.label, token: selected.token, price: selected.price }
			: null;

	return (
		<Box
			{...props}
			data-slot="FormTopup"
		>
			<Alert
				color="orange"
				variant="light"
				icon={<PiHandCoinsFill size={18} />}
				mb="lg"
			>
				<Text
					span
					size="sm"
					fw={500}
				>
					Topup Token akan segera hadir.
				</Text>{' '}
				<Text
					span
					size="sm"
					c="dimmed"
				>
					Saat ini Anda masih bisa memakai Token Harian (gratis, reset tiap hari).
				</Text>
			</Alert>

			<Text
				size="sm"
				fw={600}
				mb="xs"
			>
				Pilih Paket Token
			</Text>

			<Stack
				gap="sm"
				mb="lg"
			>
				{tokenPackages.map((pkg) => {
					const isSelected = selectedPackage === pkg.id;

					return (
						<Box
							key={pkg.id}
							component="button"
							type="button"
							onClick={() => setSelectedPackage(pkg.id)}
							className={cn(
								'text-left w-full cursor-pointer transition-colors',
								isSelected && 'ring-2 ring-primary',
							)}
							p="md"
							bd="1px solid gray.2"
							bdrs="lg"
							bg={isSelected ? 'primary.0' : 'white'}
						>
							<Group
								justify="space-between"
								wrap="nowrap"
							>
								<Group
									gap="sm"
									wrap="nowrap"
								>
									<ThemeIcon
										variant="light"
										color={pkg.color}
										size="lg"
										radius="md"
									>
										{pkg.icon}
									</ThemeIcon>
									<Stack gap={2}>
										<Group
											gap="xs"
											align="center"
										>
											<Text
												size="sm"
												fw={700}
											>
												{pkg.label}
											</Text>
											{pkg.popular ? (
												<Badge
													size="xs"
													variant="filled"
													color="primary"
													tt="none"
												>
													Popular
												</Badge>
											) : null}
										</Group>
										<Text
											size="xs"
											c="dimmed"
										>
											{pkg.description}
										</Text>
									</Stack>
								</Group>
								<Stack
									gap={2}
									align="flex-end"
								>
									<Group
										gap={4}
										align="center"
									>
										<PiCoinsFill size={14} />
										<Text
											size="sm"
											fw={700}
										>
											{pkg.token}
										</Text>
									</Group>
									<Text
										size="xs"
										fw={600}
									>
										{formatPrice(pkg.price)}
									</Text>
								</Stack>
							</Group>
						</Box>
					);
				})}

				<Box
					component="button"
					type="button"
					onClick={() => setCustomModalOpened(true)}
					className={cn(
						'text-left w-full cursor-pointer transition-colors',
						isCustom && 'ring-2 ring-primary',
					)}
					p="md"
					bd="1px solid gray.2"
					bdrs="lg"
					bg={isCustom ? 'primary.0' : 'white'}
				>
					<Group
						justify="space-between"
						wrap="nowrap"
					>
						<Group
							gap="sm"
							wrap="nowrap"
						>
							<ThemeIcon
								variant="light"
								color="gray"
								size="lg"
								radius="md"
							>
								<LuPencil size={20} />
							</ThemeIcon>
							<Stack gap={2}>
								<Text
									size="sm"
									fw={700}
								>
									Custom
								</Text>
								<Text
									size="xs"
									c="dimmed"
								>
									{isCustom && !customError
										? `${formatPrice(customPriceNumber)} • ${estimatedToken} token`
										: `Masukkan nominal sendiri (min. ${formatPrice(MIN_CUSTOM_PRICE)})`}
								</Text>
							</Stack>
						</Group>
						{isCustom ? (
							<Text
								size="xs"
								fw={600}
								c="primary"
							>
								Ubah
							</Text>
						) : null}
					</Group>
				</Box>
			</Stack>

			{summary ? (
				<Stack
					gap="xs"
					p="md"
					bd="1px solid gray.2"
					bdrs="lg"
					bg="gray.0"
					mb="lg"
				>
					<Group justify="space-between">
						<Text
							size="sm"
							c="dimmed"
						>
							{isCustom ? 'Estimasi Token' : 'Paket'}
						</Text>
						<Text
							size="sm"
							fw={600}
						>
							{isCustom
								? `${summary.token} token`
								: `${summary.label} (${summary.token} token)`}
						</Text>
					</Group>
					<Group justify="space-between">
						<Text
							size="sm"
							c="dimmed"
						>
							Total Pembayaran
						</Text>
						<Text
							size="md"
							fw={800}
							c="primary"
						>
							{formatPrice(summary.price)}
						</Text>
					</Group>
				</Stack>
			) : null}

			<Center>
				<Button
					type="button"
					size="lg"
					disabled
					leftSection={<PiHandCoinsFill size={18} />}
				>
					Coming Soon
				</Button>
			</Center>

			<Modal
				opened={customModalOpened}
				onClose={() => setCustomModalOpened(false)}
				title="Topup Custom"
				size="sm"
				centered
			>
				<Stack gap="md">
					<TextInput
						label="Nominal Topup"
						description={`Min. ${formatPrice(MIN_CUSTOM_PRICE)}, kelipatan ${formatPrice(CUSTOM_PRICE_STEP)} (tanpa titik/koma)`}
						placeholder="Contoh: 15000"
						inputMode="numeric"
						leftSection="Rp"
						value={customPrice}
						error={customError}
						onChange={(event) => {
							// Hanya terima digit angka, buang karakter lain (titik, koma, huruf).
							const digits = event.currentTarget.value.replace(/[^\d]/g, '');
							setCustomPrice(digits);
						}}
					/>

					{!customError && customPriceNumber >= MIN_CUSTOM_PRICE ? (
						<Group
							justify="space-between"
							p="sm"
							bd="1px solid gray.2"
							bdrs="md"
							bg="gray.0"
						>
							<Stack gap={0}>
								<Text
									size="xs"
									c="dimmed"
								>
									Estimasi Token
								</Text>
								<Text
									size="sm"
									fw={700}
								>
									{estimatedToken} token
								</Text>
							</Stack>
							<Stack
								gap={0}
								align="flex-end"
							>
								<Text
									size="xs"
									c="dimmed"
								>
									Total
								</Text>
								<Text
									size="sm"
									fw={800}
									c="primary"
								>
									{formatPrice(customPriceNumber)}
								</Text>
							</Stack>
						</Group>
					) : null}

					<Button
						type="button"
						disabled={
							!hasInput ||
							Boolean(customError) ||
							customPriceNumber < MIN_CUSTOM_PRICE
						}
						onClick={() => {
							setSelectedPackage(CUSTOM_PACKAGE_ID);
							setCustomModalOpened(false);
						}}
					>
						Pilih Nominal
					</Button>
				</Stack>
			</Modal>
		</Box>
	);
}
