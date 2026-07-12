import {
	Container,
	Grid,
	Image,
	Text,
	Badge,
	Button,
	Title,
	Box,
	Group,
	Card,
	SimpleGrid,
	Table,
	Accordion,
	Divider,
} from '@mantine/core';
import { FiHelpCircle } from 'react-icons/fi';
import { LuCheck } from 'react-icons/lu';
import { authGetSession } from '~app-server/session';
import { Header } from '~app-ui/layouts/header';
import { cloudflareContext } from '~workers/app';

import type { Route } from './+types/biaya-layanan';

export async function loader({ request, context }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	return {
		user,
		noIndex: context.get(cloudflareContext).env.NODE_ENV !== 'production',
	};
}

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

const tokenRates = [
	{ feature: 'KarsaLingo (Pembelajaran)', rate: '100 Token / Sesi Latihan' },
	{ feature: 'KarsaWriter (Asisten Tulis)', rate: '15 Token / 100 Kata AI' },
	{ feature: 'KarsaLator (Penerjemahan)', rate: '10 Token / 100 Kata terjemahan' },
	{ feature: 'KarsaLisa (Analisis Kesopanan)', rate: '20 Token / 100 Kata analisis' },
	{ feature: 'KarsaPedia (Ensiklopedia RAG)', rate: '50 Token / Kueri Ensiklopedia' },
	{ feature: 'KarsaFrase (Parafrase Kalimat)', rate: '15 Token / 100 Kata parafrase' },
];

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
					<Box
						bg="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
						pt={{ base: 140, md: 180 }}
						pb={{ base: 140, md: 200 }}
						c="white"
						ta="center"
					>
						<Container size="md">
							<Badge
								color="blue"
								variant="filled"
								size="lg"
								mb="md"
								radius="xl"
							>
								Fleksibel & Hemat
							</Badge>
							<Title
								order={1}
								size="3.5rem"
								fw={900}
								mb="md"
								style={{ letterSpacing: '-0.02em' }}
							>
								Bayar Sesuai Penggunaan dengan Token
							</Title>
							<Text
								size="xl"
								opacity={0.8}
								maw={600}
								mx="auto"
								fw={300}
								style={{ lineHeight: 1.6 }}
							>
								Tanpa komitmen bulanan. Beli paket token sesuai kebutuhan Anda, dan
								gunakan kapan saja tanpa khawatir hangus.
							</Text>
						</Container>
					</Box>

					<Container
						size="lg"
						style={{ marginTop: '-80px', zIndex: 10, position: 'relative' }}
					>
						{/* Pricing Cards Grid */}
						<SimpleGrid
							cols={{ base: 1, md: 3 }}
							spacing="xl"
						>
							{packages.map((pkg) => (
								<Card
									key={pkg.name}
									shadow="md"
									padding="xl"
									radius="lg"
									withBorder
									style={{
										backgroundColor: 'white',
										display: 'flex',
										flexDirection: 'column',
										borderColor: pkg.popular
											? 'var(--mantine-color-blue-5)'
											: undefined,
										borderWidth: pkg.popular ? 2 : 1,
										position: 'relative',
										overflow: 'visible',
										transition: 'transform 200ms ease',
									}}
									onMouseEnter={(e) =>
										(e.currentTarget.style.transform = 'translateY(-5px)')
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.transform = 'translateY(0)')
									}
								>
									{pkg.popular && (
										<Badge
											color="blue"
											variant="filled"
											style={{
												position: 'absolute',
												top: -12,
												left: '50%',
												transform: 'translateX(-50%)',
												zIndex: 1,
											}}
										>
											Paling Populer
										</Badge>
									)}

									<Text
										size="xs"
										fw={700}
										c="dimmed"
										tt="uppercase"
										mb="xs"
									>
										{pkg.name}
									</Text>

									<Group
										align="flex-end"
										gap={5}
										mb="md"
									>
										<Text
											size="2.5rem"
											fw={900}
											style={{ lineHeight: 1 }}
										>
											{pkg.price}
										</Text>
									</Group>

									<Badge
										color="blue"
										variant="light"
										size="xl"
										radius="sm"
										mb="lg"
									>
										{pkg.tokens}
									</Badge>

									<Text
										size="sm"
										c="dimmed"
										mb="xl"
										style={{ minHeight: 40 }}
									>
										{pkg.tagline}
									</Text>

									<Divider my="md" />

									<Box
										style={{ flexGrow: 1 }}
										mb="xl"
									>
										{pkg.features.map((feat, idx) => (
											<Group
												key={idx}
												gap="sm"
												mb="xs"
												wrap="nowrap"
												align="flex-start"
											>
												<LuCheck
													size={16}
													color="var(--mantine-color-blue-6)"
													style={{ flexShrink: 0, marginTop: 3 }}
												/>
												<Text
													size="sm"
													c="dark.7"
												>
													{feat}
												</Text>
											</Group>
										))}
									</Box>

									<Button
										variant={pkg.popular ? 'filled' : 'outline'}
										color="blue"
										fullWidth
										size="md"
										radius="md"
										mt="auto"
									>
										Beli Paket
									</Button>
								</Card>
							))}
						</SimpleGrid>

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
								c="dimmed"
								mb="xl"
								ta="center"
								maw={500}
								mx="auto"
							>
								Setiap kali Anda menggunakan layanan AI, saldo token Anda akan
								dikurangi berdasarkan tarif modul layanan di bawah ini.
							</Text>

							<Table
								striped
								highlightOnHover
								withTableBorder
								withColumnBorders
							>
								<Table.Thead bg="gray.1">
									<Table.Tr>
										<Table.Th>
											<Text fw={700}>Modul Layanan</Text>
										</Table.Th>
										<Table.Th>
											<Text fw={700}>Tarif Konsumsi Token</Text>
										</Table.Th>
									</Table.Tr>
								</Table.Thead>
								<Table.Tbody>
									{tokenRates.map((rate) => (
										<Table.Tr key={rate.feature}>
											<Table.Td>
												<Text
													fw={600}
													size="sm"
												>
													{rate.feature}
												</Text>
											</Table.Td>
											<Table.Td>
												<Text size="sm">{rate.rate}</Text>
											</Table.Td>
										</Table.Tr>
									))}
								</Table.Tbody>
							</Table>
						</Box>

						{/* FAQ Accordion */}
						<Box
							mt={80}
							maw={800}
							mx="auto"
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
							>
								<Accordion.Item value="what-is-token">
									<Accordion.Control
										icon={
											<FiHelpCircle
												size={18}
												color="var(--mantine-color-blue-6)"
											/>
										}
									>
										Apa yang dimaksud dengan Token KarsaKito?
									</Accordion.Control>
									<Accordion.Panel>
										Token adalah satuan kredit yang digunakan untuk menggunakan
										fitur kecerdasan buatan (AI) di platform KarsaKito. Setiap
										pemanggilan AI seperti terjemahan, pembuatan artikel,
										pembelajaran, atau pencarian ensiklopedia memerlukan
										sejumlah token sesuai tarif yang berlaku.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="expiry">
									<Accordion.Control
										icon={
											<FiHelpCircle
												size={18}
												color="var(--mantine-color-blue-6)"
											/>
										}
									>
										Apakah token KarsaKito memiliki masa kadaluwarsa?
									</Accordion.Control>
									<Accordion.Panel>
										Tidak. Seluruh token yang Anda beli tidak memiliki masa
										kadaluwarsa. Token akan tetap tersimpan di akun Anda dan
										hanya akan berkurang saat Anda menggunakannya untuk
										berinteraksi dengan layanan AI kami.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="how-to-topup">
									<Accordion.Control
										icon={
											<FiHelpCircle
												size={18}
												color="var(--mantine-color-blue-6)"
											/>
										}
									>
										Bagaimana cara melakukan pembayaran dan top-up?
									</Accordion.Control>
									<Accordion.Panel>
										Anda dapat melakukan pembelian token langsung dari dashboard
										akun Anda melalui berbagai metode pembayaran aman di
										Indonesia seperti QRIS, Transfer Bank (Virtual Account),
										E-Wallet (GoPay, OVO, Dana), maupun Kartu Kredit. Token Anda
										akan langsung bertambah secara instan setelah pembayaran
										diverifikasi.
									</Accordion.Panel>
								</Accordion.Item>

								<Accordion.Item value="api-access">
									<Accordion.Control
										icon={
											<FiHelpCircle
												size={18}
												color="var(--mantine-color-blue-6)"
											/>
										}
									>
										Apakah saya bisa menggunakan token saya untuk integrasi API
										pihak ketiga?
									</Accordion.Control>
									<Accordion.Panel>
										Ya, bagi pemilik Paket Rajo, Anda dapat men-generate API Key
										dari dashboard KarsaKito Anda. API tersebut dapat
										diintegrasikan dengan aplikasi, website, atau chatbot milik
										institusi Anda sendiri dengan tarif token yang sama.
									</Accordion.Panel>
								</Accordion.Item>
							</Accordion>
						</Box>
					</Container>
				</Box>

				{/* Footer Edge-to-Edge */}
				<footer className="relative z-20 mt-auto w-full border-t border-slate-900 bg-slate-950 text-white">
					<div className="mx-auto flex w-full flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-slate-400 sm:flex-row sm:px-6 md:text-sm lg:px-8">
						<div className="text-center sm:text-left">
							© 2026 Team Kito. All rights reserved.
						</div>
						<div className="text-center font-medium tracking-wide sm:text-right">
							Hackathon X DIGDAYA 2026 – Bank Indonesia
						</div>
					</div>
				</footer>
			</main>
		</div>
	);
}
