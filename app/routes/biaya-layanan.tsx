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
	SimpleGrid,
	Table,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { FiHelpCircle } from 'react-icons/fi';
import { LuCheck } from 'react-icons/lu';
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

const tokenRates = [
	{ feature: 'KarsaLingo (Pembelajaran)', rate: '100 Token / Sesi Latihan' },
	{ feature: 'KarsaWriter (Asisten Tulis)', rate: '15 Token / 100 Kata AI' },
	{ feature: 'KarsaLator (Penerjemahan)', rate: '10 Token / 100 Kata terjemahan' },
	{ feature: 'KarsaLisa (Analisis Kesopanan)', rate: '20 Token / 100 Kata analisis' },
	{ feature: 'KarsaPedia (Ensiklopedia RAG)', rate: '50 Token / Kueri Ensiklopedia' },
	{ feature: 'KarsaFrase (Parafrase Kalimat)', rate: '15 Token / 100 Kata parafrase' },
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
			</main>
			<Footer />
		</div>
	);
}
