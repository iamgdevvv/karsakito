import {
	Alert,
	Badge,
	Box,
	Button,
	Group,
	Modal,
	NumberInput,
	Stack,
	Text,
	ThemeIcon,
	type BoxProps,
} from '@mantine/core';
import { useMemo, useState } from 'react';
import { LuCrown, LuGem, LuGift, LuPencil, LuSparkles } from 'react-icons/lu';
import { PiCoinsFill, PiHandCoinsFill } from 'react-icons/pi';
import { cn, displayPrice } from '~app-modules/utils';

type TokenPackage = {
	id: string;
	token: number;
	label: string;
	description: string;
	icon: React.ReactNode;
	color: string;
	popular?: boolean;
};

const tokenPackages: TokenPackage[] = [
	{
		id: 'pkg-50',
		token: 200,
		label: 'Starter',
		description: 'Cocok untuk coba-coba',
		icon: <LuSparkles size={22} />,
		color: 'teal',
	},
	{
		id: 'pkg-100',
		token: 500,
		label: 'Basic',
		description: 'Paling laris untuk harian',
		icon: <LuGift size={22} />,
		color: 'grape',
		popular: true,
	},
	{
		id: 'pkg-200',
		token: 800,
		label: 'Plus',
		description: 'Lebih hemat untuk produktif',
		icon: <LuGem size={22} />,
		color: 'blue',
	},
	{
		id: 'pkg-500',
		token: 1000,
		label: 'Pro',
		description: 'Untuk pengguna aktif',
		icon: <LuCrown size={22} />,
		color: 'orange',
	},
];

const CUSTOM_PACKAGE_ID = 'pkg-custom';
const MIN_CUSTOM_PRICE = 10000;
const CUSTOM_PRICE_STEP = 1000;
const TOKEN_PER_RUPIAH = 50;

export default function FormTopup({ ...props }: BoxProps) {
	const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
	const [customPrice, setCustomPrice] = useState<number | undefined>(undefined);
	const [customModalOpened, setCustomModalOpened] = useState(false);
	const selected = tokenPackages.find((p) => p.id === selectedPackage);
	const isCustom = selectedPackage === CUSTOM_PACKAGE_ID;

	const customToken = useMemo(() => {
		if (customPrice) {
			return Math.round(customPrice / TOKEN_PER_RUPIAH);
		}

		return 0;
	}, [customPrice]);

	const summaryBiling = useMemo(() => {
		if (isCustom && customPrice) {
			return {
				label: 'Custom',
				token: customToken,
				price: customPrice,
			};
		}

		if (selected) {
			return {
				label: selected.label,
				token: selected.token,
				price: selected.token * TOKEN_PER_RUPIAH,
			};
		}

		return null;
	}, [isCustom, selected, customToken, customPrice]);

	const customPriceError = useMemo(() => {
		if (isCustom && customPrice !== undefined) {
			if (customPrice < MIN_CUSTOM_PRICE) {
				return `Minimal ${displayPrice(MIN_CUSTOM_PRICE)}`;
			}

			if (customPrice % CUSTOM_PRICE_STEP !== 0) {
				return `Harus kelipatan ${displayPrice(CUSTOM_PRICE_STEP)} (contoh: 10.000, 11.000)`;
			}
		}

		return null;
	}, []);

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
													variant="light"
													color="primary"
													tt="none"
												>
													Pilihan Terbaik
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
										{displayPrice(pkg.token * TOKEN_PER_RUPIAH)}
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
									{customPrice && !customPriceError
										? `${displayPrice(customPrice)} • ${customToken} token`
										: `Masukkan nominal sendiri (min. ${displayPrice(MIN_CUSTOM_PRICE)})`}
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

			{summaryBiling ? (
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
								? `${summaryBiling.token} token`
								: `${summaryBiling.label} (${summaryBiling.token} token)`}
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
							{displayPrice(summaryBiling.price)}
						</Text>
					</Group>
				</Stack>
			) : null}

			<Group
				justify="flex-end"
				mt="lg"
			>
				<Button
					type="button"
					size="lg"
					disabled
					leftSection={<PiHandCoinsFill size={18} />}
				>
					Coming Soon
				</Button>
			</Group>

			<Modal
				opened={customModalOpened}
				onClose={() => setCustomModalOpened(false)}
				title={
					<Text
						span
						size="md"
						fw={700}
					>
						Topup Custom
					</Text>
				}
				size="sm"
				centered
			>
				<Stack gap="md">
					<NumberInput
						label="Nominal Topup"
						description={
							<Text
								span
								size="xs"
							>
								Min. {displayPrice(MIN_CUSTOM_PRICE)}, kelipatan{' '}
								{displayPrice(CUSTOM_PRICE_STEP)} (tanpa titik/koma)
							</Text>
						}
						placeholder="Contoh: 15000"
						leftSection="Rp"
						value={customPrice}
						onChange={(value) => {
							setCustomPrice(Number(value));
						}}
						min={MIN_CUSTOM_PRICE}
						step={CUSTOM_PRICE_STEP}
						error={customPriceError}
					/>

					{customPrice && customPrice >= MIN_CUSTOM_PRICE ? (
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
									{customToken} token
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
									{displayPrice(customPrice)}
								</Text>
							</Stack>
						</Group>
					) : null}

					<Group justify="flex-end">
						<Button
							type="button"
							disabled={
								Boolean(customPriceError) ||
								Boolean(customPrice && customPrice < MIN_CUSTOM_PRICE)
							}
							onClick={() => {
								setSelectedPackage(CUSTOM_PACKAGE_ID);
								setCustomModalOpened(false);
							}}
						>
							Pilih Nominal
						</Button>
					</Group>
				</Stack>
			</Modal>
		</Box>
	);
}
