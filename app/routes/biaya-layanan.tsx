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
	Stack,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { LuCheck } from 'react-icons/lu';
import { TbApiApp } from 'react-icons/tb';
import { labelAppCategory } from '~app-modules/enum-options';
import { getPublicFaqs } from '~app-modules/faqs';
import { metaPublicRoute } from '~app-modules/meta';
import { breadcrumbSchema, isCanonicalSiteRequest, pageSchema, seoSchema } from '~app-modules/seo';
import { actionGetKarsaApps } from '~app-server/app';
import { authGetSession } from '~app-server/session';
import Banner from '~app-ui/layouts/banner';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';

import type { Route } from './+types/biaya-layanan';

const pageTitle = 'Biaya Layanan | KarsaKito';
const pageDescription =
	'Lihat estimasi harga Token KarsaKito dan tarif penggunaan Token untuk tool yang tersedia.';

export async function loader({ request, context }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');
	const karsaApps = await actionGetKarsaApps({
		request,
		context,
		customParams: {
			total: 1000,
			visible: true,
		},
	});

	return {
		user,
		karsaApps,
		noIndex: !isCanonicalSiteRequest(request),
	};
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaPublicRoute({
		title: pageTitle,
		description: pageDescription,
		noIndex: loaderData.noIndex,
		canonicalPath: '/biaya-layanan',
		structuredData: seoSchema(
			pageSchema({
				name: pageTitle,
				description: pageDescription,
				path: '/biaya-layanan',
				hasBreadcrumb: true,
			}),
			breadcrumbSchema('/biaya-layanan', [
				{ name: 'KarsaKito', path: '/' },
				{ name: 'Biaya Layanan', path: '/biaya-layanan' },
			]),
		),
	});
}

const packages = [
	{
		name: '200 Token',
		tagline: 'Untuk mencoba beberapa kebutuhan di KarsaKito.',
		price: 10_000,
		tokens: 200,
		features: [
			'Token digunakan untuk memakai fitur KarsaKito',
			'Token tidak memiliki masa berlaku',
		],
	},
	{
		name: '500 Token',
		tagline: 'Untuk kebutuhan rutin saat menulis dan mengolah teks.',
		price: 25_000,
		tokens: 500,
		features: [
			'Token digunakan untuk memakai fitur KarsaKito',
			'Token tidak memiliki masa berlaku',
		],
	},
	{
		name: '800 Token',
		tagline: 'Untuk pekerjaan yang lebih banyak dalam satu periode.',
		price: 40_000,
		tokens: 800,
		features: [
			'Token digunakan untuk memakai fitur KarsaKito',
			'Token tidak memiliki masa berlaku',
		],
	},
	{
		name: '1.000 Token',
		tagline: 'Untuk Pengguna yang ingin menyiapkan Token lebih banyak.',
		price: 50_000,
		tokens: 1_000,
		features: [
			'Token digunakan untuk memakai fitur KarsaKito',
			'Token tidak memiliki masa berlaku',
		],
	},
];

const faqs = getPublicFaqs(['token'], { featuredOnly: true });

export default function BiayaLayananRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<Header authUser={loaderData.user} />
			<main
				id="main-content"
				tabIndex={-1}
				className="site-main"
			>
				<Box
					bg="gray.0"
					component="section"
					pb={{
						base: 48,
						sm: 60,
						lg: 80,
					}}
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
							Estimasi Harga
						</Text>
						<Title>Kenali estimasi harga Token</Title>
						<Text>
							Token digunakan untuk memakai fitur KarsaKito, bukan untuk membayar API
							AI. Pembelian Token sedang disiapkan; harga berikut adalah estimasi Rp50
							per Token.
						</Text>
					</Banner>

					<Container
						size="lg"
						mt={-80}
					>
						{/* Pricing Cards Grid */}
						<SimpleGrid
							cols={{
								base: 1,
								md: 2,
								lg: 4,
							}}
							spacing="xs"
						>
							{packages.map((pkg, index) => (
								<Card
									key={`${pkg.name}-${index}`}
									shadow="md"
									p={{
										base: 'lg',
										md: 'xl',
									}}
									radius="xl"
									bg="white"
									className="translate-y-0 overflow-visible transition-transform lg:hover:-translate-y-3"
									bd="1px solid gray.2"
								>
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
											prefix="Rp"
											value={pkg.price}
											thousandSeparator
										/>
									</Text>

									<Badge
										variant="light"
										fz="xs"
										mb="lg"
									>
										<NumberFormatter
											value={pkg.tokens}
											thousandSeparator
											suffix=" Token"
										/>
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
													size="sm"
												>
													<LuCheck size={12} />
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
										variant="outline"
										fullWidth
										size="lg"
										fz="md"
										mt="auto"
										disabled
									>
										Belum tersedia
									</Button>
								</Card>
							))}
						</SimpleGrid>
						<Text
							ta="center"
							c="gray.6"
							size="sm"
							mt="xl"
						>
							Nominal lain dapat diperkirakan mulai Rp10.000 dalam kelipatan Rp1.000.
							Estimasi harga Rp50 per Token serta saat ini pembelian Token belum
							tersedia.
						</Text>
					</Container>
				</Box>

				<Box
					component="section"
					py={{
						base: 48,
						sm: 60,
						lg: 80,
					}}
				>
					<Container>
						<Stack
							gap="xs"
							w="100%"
							maw={600}
							mx="auto"
							ta="center"
						>
							<Title order={2}>Tarif penggunaan Token</Title>
							<Text
								c="gray.6"
								ta="center"
								maw={500}
								mx="auto"
							>
								Setiap tool membutuhkan jumlah Token per sesi yang berbeda. Token
								Harian digunakan lebih dahulu saat Anda memakai tool.
							</Text>
						</Stack>

						<SimpleGrid
							mt="xl"
							spacing="lg"
							cols={{ base: 1, sm: 2, md: 3 }}
						>
							{loaderData.karsaApps.data.map((karsaApp, index) => {
								return (
									<Stack
										key={`${karsaApp.id}-${index}`}
										gap={0}
										p={{
											base: 'lg',
											md: 'xl',
										}}
										bdrs="xl"
										bg="gray.0"
										bd="1px solid gray.4"
										className="shadow-md transition not-hover:shadow-transparent lg:hover:-translate-y-2"
									>
										<Group
											justify="space-between"
											mb="md"
										>
											<ThemeIcon
												size={48}
												radius="md"
												variant="light"
											>
												<TbApiApp size={28} />
											</ThemeIcon>
											<Badge
												variant="light"
												size="lg"
												fz="xs"
												fw={500}
											>
												{labelAppCategory[karsaApp.category]}
											</Badge>
										</Group>

										<Title
											order={3}
											fw={700}
											fz="lg"
										>
											{karsaApp.label}
										</Title>

										{karsaApp.description ? (
											<Text
												size="sm"
												c="gray.6"
												fw={300}
												mt="xs"
												mb="xl"
												style={{ flexGrow: 1 }}
											>
												{karsaApp.description}
											</Text>
										) : null}

										<Group
											gap={6}
											align="baseline"
											mt="auto"
										>
											<Text
												fw={700}
												size="xl"
												c="primary"
											>
												{karsaApp.tokenPromo ? (
													<Text
														span
														inherit
													>
														{karsaApp.tokenPromo}
														<Text
															span
															display="inline-block"
															fz="0.68em"
															td="line-through"
															c="gray.6"
															ml={2}
														>
															{karsaApp.token}
														</Text>
													</Text>
												) : (
													karsaApp.token
												)}
											</Text>
											<Text size="sm">Token per sesi</Text>
										</Group>
									</Stack>
								);
							})}
						</SimpleGrid>
					</Container>
				</Box>

				<Box
					component="section"
					id="faq"
					aria-labelledby="faq-title-biaya"
					bg="gray.0"
					py={{
						base: 48,
						sm: 60,
						lg: 80,
					}}
				>
					<Container size="sm">
						<Stack
							gap="sm"
							ta="center"
							align="center"
						>
							<Badge
								variant="light"
								size="lg"
								fz={10}
								fw={500}
							>
								FAQ
							</Badge>
							<Title
								id="faq-title-biaya"
								order={2}
							>
								Pertanyaan yang sering ditanyakan
							</Title>
							<Text>Pahami cara kerja Token dan penggunaan tool KarsaKito.</Text>
						</Stack>

						<Accordion
							variant="separated"
							mt="xl"
							order={3}
							defaultValue={faqs[0].title}
						>
							{faqs.map((faq, index) => (
								<Accordion.Item
									key={`faq-${index}`}
									value={faq.title}
								>
									<Accordion.Control>
										<Text
											span
											fz="sm"
											fw={500}
										>
											{faq.title}
										</Text>
									</Accordion.Control>
									<Accordion.Panel fz="sm">{faq.content}</Accordion.Panel>
								</Accordion.Item>
							))}
						</Accordion>
					</Container>
				</Box>
			</main>
			<Footer />
		</div>
	);
}
