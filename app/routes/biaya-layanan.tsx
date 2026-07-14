import {
	Accordion,
	Badge,
	Box,
	Button,
	Card,
	Container,
	Divider,
	Group,
	NumberFormatter,
	Paper,
	SimpleGrid,
	Table,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { LuCheck } from 'react-icons/lu';
import {
	IconSchool,
	IconPencil,
	IconLanguage,
	IconUserCheck,
	IconSearch,
	IconArrowsShuffle,
} from '@tabler/icons-react';
import { metaPublicRoute } from '~app-modules/meta';
import { authGetSession } from '~app-server/session';
import Banner from '~app-ui/layouts/banner';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';
import { cloudflareContext } from '~workers/app';

import type { Route } from './+types/biaya-layanan';

const packages = [
	{
		name: 'Paket Sutan',
		tagline: 'Cocok untuk pelajar dan eksplorasi dasar.',
		price: 'Rp 15.000',
		tokens: '100.000 Token',
		popular: false,
		features: [
			'Akses ke seluruh 6 modul AI',
			'Minangkabau RAG Knowledge Base',
			'Masa aktif selamanya (no expiry)',
			'Standar kuota API',
		],
	},
	{
		name: 'Paket Datuk',
		tagline: 'Pilihan terbaik untuk kreator dan peneliti budaya.',
		price: 'Rp 50.000',
		tokens: '500.000 Token',
		popular: true,
		features: [
			'Akses ke seluruh 6 modul AI',
			'Minangkabau RAG Knowledge Base',
			'Masa aktif selamanya (no expiry)',
			'Prioritas pemrosesan server AI',
			'Dukungan email prioritas',
		],
	},
	{
		name: 'Paket Rajo',
		tagline: 'Ideal untuk instansi, sekolah, dan developer.',
		price: 'Rp 150.000',
		tokens: '2.000.000 Token',
		popular: false,
		features: [
			'Akses ke seluruh 6 modul AI',
			'Minangkabau RAG Knowledge Base',
			'Masa aktif selamanya (no expiry)',
			'Prioritas pemrosesan server tertinggi',
			'Akses Kunci API untuk integrasi aplikasi',
			'Dedicated support channel',
		],
	},
];

const servicesCatalog = [
	{
		title: 'KarsaLingo',
		category: 'Pembelajaran',
		description: 'Berlatih dan tingkatkan kemampuan bahasa Anda dengan interaksi AI cerdas.',
		price: '100',
		unit: 'Token / Sesi',
		icon: IconSchool,
		color: 'blue',
	},
	{
		title: 'KarsaWriter',
		category: 'Asisten Tulis',
		description: 'Bantuan menyusun kerangka tulisan, artikel, dan konten dengan cepat.',
		price: '15',
		unit: 'Token / 100 Kata',
		icon: IconPencil,
		color: 'teal',
	},
	{
		title: 'KarsaLator',
		category: 'Penerjemahan',
		description: 'Penerjemahan teks dari dan ke bahasa Minang dengan akurasi tinggi.',
		price: '10',
		unit: 'Token / 100 Kata',
		icon: IconLanguage,
		color: 'grape',
	},
	{
		title: 'KarsaLisa',
		category: 'Analisis Kesopanan',
		description: 'Evaluasi tata bahasa dan tingkat kesopanan kalimat Anda.',
		price: '20',
		unit: 'Token / 100 Kata',
		icon: IconUserCheck,
		color: 'pink',
	},
	{
		title: 'KarsaPedia',
		category: 'Ensiklopedia RAG',
		description: 'Pencarian informasi budaya dan sejarah berbasis AI Knowledge Base.',
		price: '50',
		unit: 'Token / Kueri',
		icon: IconSearch,
		color: 'orange',
	},
	{
		title: 'KarsaFrase',
		category: 'Parafrase Kalimat',
		description: 'Ubah struktur kalimat tanpa mengubah makna dan konteks asli.',
		price: '15',
		unit: 'Token / 100 Kata',
		icon: IconArrowsShuffle,
		color: 'cyan',
	},
];

export async function loader({ request, context }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	return {
		user,
		noIndex: context.get(cloudflareContext).env.NODE_ENV !== 'production',
	};
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaPublicRoute({
		title: 'Biaya Layanan KarsaKito',
		noIndex: loaderData.noIndex,
	});
}

export default function BiayaLayanan({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<Header authUser={loaderData.user} />
			<main className="site-main">
				<Box
					bg="gray.0"
					pb={80}
					style={{ minHeight: '100vh' }}
				>
					{/* Hero Section */}
					<Banner
						background="/images/karsakito-beranda-banner.jpg"
						ta="center"
						justify="center"
						pb="xl"
					>
						<Text
							span
							size="xs"
							fw={700}
							c="primary"
							tt="uppercase"
						>
							Fleksibel & Hemat
						</Text>
						<Title>Bayar Sesuai Penggunaan dengan Token</Title>
						<Text>
							Tanpa komitmen bulanan. Beli paket token sesuai kebutuhan Anda, dan
							gunakan kapan saja tanpa khawatir hangus.
						</Text>
					</Banner>

					<Container
						size="lg"
						style={{ marginTop: '-80px', zIndex: 10, position: 'relative' }}
					>
						{/* Pricing Cards Grid */}
						<SimpleGrid
							cols={{ base: 1, md: 3 }}
							spacing="xl"
						>
							{packages.map((pkg, index) => (
								<Card
									key={`${pkg.name}-${index}`}
									shadow="md"
									padding="xl"
									radius="xl"
									bg="white"
									className="translate-y-0 overflow-visible transition-transform lg:hover:-translate-y-3"
									bd={pkg.popular ? '2px solid primary' : '1px solid gray.2'}
								>
									{pkg.popular && (
										<Badge
											variant="filled"
											size="xl"
											fz="xs"
											pos="absolute"
											top={0}
											left={'50%'}
											className="z-1 -translate-1/2"
										>
											Paling Populer
										</Badge>
									)}

									<Text
										span
										fz="xs"
										fw={700}
										c="gray.6"
										tt="uppercase"
										mb="xs"
									>
										{pkg.name}
									</Text>

									<Text
										span
										fz={{
											base: 'xl',
											lg: 32,
										}}
										fw={700}
										display="inline-block"
									>
										<NumberFormatter
											prefix="Rp "
											value={pkg.price}
											thousandSeparator
										/>
									</Text>

									<Badge
										variant="light"
										size="xl"
										fz="xs"
										mb="lg"
									>
										{pkg.tokens}
									</Badge>

									<Text
										size="sm"
										c="gray.6"
										mih={{
											md: 48,
										}}
										mb="xl"
									>
										{pkg.tagline}
									</Text>

									<Divider mb="md" />

									<Box mb="xl">
										{pkg.features.map((feat, idx) => (
											<Group
												key={idx}
												gap="sm"
												mb="xs"
												wrap="nowrap"
												align="flex-start"
											>
												<ThemeIcon
													variant="light"
													radius="full"
												>
													<LuCheck size={16} />
												</ThemeIcon>
												<Text
													span
													size="sm"
												>
													{feat}
												</Text>
											</Group>
										))}
									</Box>

									<Button
										variant={pkg.popular ? 'filled' : 'outline'}
										fullWidth
										mt="auto"
									>
										Beli Paket
									</Button>
								</Card>
							))}
						</SimpleGrid>

						{/* REVISI */}
						{/* Token Consumption Rate Table */}
						<Box
							mt={80}
							p={{ base: 'lg', md: 'xl' }}
							style={{
								backgroundColor: 'white',
								borderRadius: '16px',
								border: '1px solid #e2e8f0',
							}}
						>
							<Title
								order={2}
								size="1.8rem"
								fw={800}
								mb="xs"
								ta="center"
							>
								Tarif Penggunaan Token
							</Title>
							<Text
								size="sm"
								c="gray.6"
								mb="xl"
								ta="center"
								maw={500}
								mx="auto"
							>
								Setiap kali Anda menggunakan layanan AI, saldo token Anda akan
								dikurangi berdasarkan tarif modul layanan di bawah ini.
							</Text>

							<SimpleGrid
								cols={{ base: 1, sm: 2, md: 3 }}
								spacing="lg"
								mt="xl"
							>
								{servicesCatalog.map((service) => {
									const Icon = service.icon;
									return (
										<Card
											key={service.title}
											shadow="sm"
											padding="xl"
											radius="md"
											withBorder
											className="transition-transform lg:hover:-translate-y-2 hover:shadow-md"
											style={{ display: 'flex', flexDirection: 'column' }}
										>
											<Group justify="space-between" mb="md">
												<ThemeIcon size={48} radius="md" variant="light" color={service.color}>
													<Icon size={28} stroke={1.5} />
												</ThemeIcon>
												<Badge color={service.color} variant="light" size="lg">
													{service.category}
												</Badge>
											</Group>

											<Text fw={700} size="lg">
												{service.title}
											</Text>

											<Text size="sm" c="gray.6" mt="xs" mb="xl" style={{ flexGrow: 1 }}>
												{service.description}
											</Text>

											<Group gap={6} align="baseline" mt="auto">
												<Text fw={800} size="xl" c="primary">
													{service.price}
												</Text>
												<Text size="sm" fw={600} c="gray.7">
													{service.unit}
												</Text>
											</Group>
										</Card>
									);
								})}
							</SimpleGrid>
						</Box>

						{/* FAQ Accordion */}
						<Container size="md" mt={80}>
							<Paper
								withBorder
								shadow="sm"
								radius="lg"
								p={{ base: 'xl', md: 40 }}
								bg="gray.0"
							>
								<Title
									order={2}
									size="1.8rem"
									fw={800}
									mb="xl"
									ta="center"
								>
									Pertanyaan yang Sering Diajukan
								</Title>

								<Accordion
									variant="separated"
									radius="md"
									styles={{
										item: { backgroundColor: 'white', border: '1px solid var(--mantine-color-gray-2)' },
										control: { padding: 'var(--mantine-spacing-md)' },
										content: { padding: 'var(--mantine-spacing-md)', paddingTop: 0 }
									}}
								>
									<Accordion.Item value="what-is-token">
										<Accordion.Control>
											<Text fw={600}>Apa yang dimaksud dengan Token KarsaKito?</Text>
										</Accordion.Control>
										<Accordion.Panel>
											<Text c="gray.7" lh={1.6}>
												Token adalah satuan kredit yang digunakan untuk menggunakan
												fitur kecerdasan buatan (AI) di platform KarsaKito. Setiap
												pemanggilan AI seperti terjemahan, pembuatan artikel,
												pembelajaran, atau pencarian ensiklopedia memerlukan
												sejumlah token sesuai tarif yang berlaku.
											</Text>
										</Accordion.Panel>
									</Accordion.Item>

									<Accordion.Item value="expiry">
										<Accordion.Control>
											<Text fw={600}>Apakah token KarsaKito memiliki masa kadaluwarsa?</Text>
										</Accordion.Control>
										<Accordion.Panel>
											<Text c="gray.7" lh={1.6}>
												Tidak. Seluruh token yang Anda beli tidak memiliki masa
												kadaluwarsa. Token akan tetap tersimpan di akun Anda dan
												hanya akan berkurang saat Anda menggunakannya untuk
												berinteraksi dengan layanan AI kami.
											</Text>
										</Accordion.Panel>
									</Accordion.Item>

									<Accordion.Item value="how-to-topup">
										<Accordion.Control>
											<Text fw={600}>Bagaimana cara melakukan pembayaran dan top-up?</Text>
										</Accordion.Control>
										<Accordion.Panel>
											<Text c="gray.7" lh={1.6}>
												Anda dapat melakukan pembelian token langsung dari dashboard
												akun Anda melalui berbagai metode pembayaran aman di
												Indonesia seperti QRIS, Transfer Bank (Virtual Account),
												E-Wallet (GoPay, OVO, Dana), maupun Kartu Kredit. Token Anda
												akan langsung bertambah secara instan setelah pembayaran
												diverifikasi.
											</Text>
										</Accordion.Panel>
									</Accordion.Item>

									<Accordion.Item value="api-access">
										<Accordion.Control>
											<Text fw={600}>Apakah saya bisa menggunakan token saya untuk integrasi API pihak ketiga?</Text>
										</Accordion.Control>
										<Accordion.Panel>
											<Text c="gray.7" lh={1.6}>
												Ya, bagi pemilik Paket Rajo, Anda dapat men-generate API Key
												dari dashboard KarsaKito Anda. API tersebut dapat
												diintegrasikan dengan aplikasi, website, atau chatbot milik
												institusi Anda sendiri dengan tarif token yang sama.
											</Text>
										</Accordion.Panel>
									</Accordion.Item>
								</Accordion>
							</Paper>
						</Container>
					</Container>
				</Box>
			</main>
			<Footer />
		</div>
	);
}
