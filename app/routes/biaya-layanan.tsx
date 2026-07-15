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
import { metaPublicRoute } from '~app-modules/meta';
import { actionGetKarsaApps } from '~app-server/app';
import { cfContext } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import Banner from '~app-ui/layouts/banner';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';

import type { Route } from './+types/biaya-layanan';

export async function loader({ request, context }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');
	const karsaApps = await actionGetKarsaApps({
		request,
		context,
		customParams: {
			total: 1000,
		},
	});

	return {
		user,
		karsaApps,
		noIndex: cfContext(context).env.NODE_ENV !== 'production',
	};
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaPublicRoute({
		title: 'Biaya Layanan KarsaKito',
		noIndex: loaderData.noIndex,
	});
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

const faqs = [
	{
		title: 'How does the AI generate content?',
		content:
			'The AI generates content using a combination of natural language processing and machine learning algorithms.',
	},
	{
		title: 'Can i customize the AI-generated content?',
		content:
			'Yes, you can customize the AI-generated content to meet your specific needs untuk Mengakselerasi Pemanfaatan Bahasa dan Warisan Budaya Daerah',
	},
	{
		title: 'What types of content can the AI generate?',
		content:
			'The AI can generate a wide range of content types, including text, images, videos, and more.',
	},
	{
		title: 'Is the AI-generated content plagiarism-free?',
		content:
			'Yes, the AI-generated content is plagiarism-free and is not copied from other sources.',
	},
	{
		title: 'Does the tool have any limitations?',
		content: 'The tool has no limitations and can be used for any purpose.',
	},
];

export default function BiayaLayananRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<Header authUser={loaderData.user} />
			<main className="site-main">
				<Box
					bg="gray.0"
					component="section"
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
						mt={-80}
					>
						{/* Pricing Cards Grid */}
						<SimpleGrid
							cols={{
								base: 1,
								md: 3,
							}}
							spacing="xl"
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
										size="lg"
										fz="md"
										mt="auto"
									>
										Beli Paket
									</Button>
								</Card>
							))}
						</SimpleGrid>
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
							<Title order={2}>Tarif Penggunaan Token</Title>
							<Text
								c="gray.6"
								ta="center"
								maw={500}
								mx="auto"
							>
								Setiap kali Anda menggunakan layanan AI, saldo token Anda akan
								dikurangi berdasarkan tarif modul layanan di bawah ini.
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
											<Text size="sm">Token/sesi</Text>
										</Group>
									</Stack>
								);
							})}
						</SimpleGrid>
					</Container>
				</Box>

				<Box
					component="section"
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
							<Title order={2}>Frequently Asked Questions</Title>
							<Text>
								Everything you need to know about the product and other information.
							</Text>
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
