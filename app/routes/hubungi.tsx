import {
	Accordion,
	Anchor,
	Badge,
	Box,
	Card,
	Container,
	Grid,
	Group,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { FiMail, FiMapPin } from 'react-icons/fi';
import { getPublicFaqs } from '~app-modules/faqs';
import { metaPublicRoute } from '~app-modules/meta';
import { breadcrumbSchema, isCanonicalSiteRequest, pageSchema, seoSchema } from '~app-modules/seo';
import { actionSendEmailContact } from '~app-server/email';
import { authGetSession } from '~app-server/session';
import FormContact from '~app-ui/form/contact';
import Banner from '~app-ui/layouts/banner';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';

import type { Route } from './+types/hubungi';

const pageTitle = 'Hubungi Kito | KarsaKito';
const pageDescription =
	'Hubungi tim Kito untuk menyampaikan pertanyaan, masukan, atau kebutuhan terkait KarsaKito.';

export async function loader({ request }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	return {
		user,
		noIndex: !isCanonicalSiteRequest(request),
	};
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaPublicRoute({
		title: pageTitle,
		description: pageDescription,
		noIndex: loaderData.noIndex,
		canonicalPath: '/hubungi',
		structuredData: seoSchema(
			pageSchema({
				name: pageTitle,
				description: pageDescription,
				path: '/hubungi',
				type: 'ContactPage',
				hasBreadcrumb: true,
			}),
			breadcrumbSchema('/hubungi', [
				{ name: 'KarsaKito', path: '/' },
				{ name: 'Hubungi Kito', path: '/hubungi' },
			]),
		),
	});
}

const faqs = getPublicFaqs(['tentang', 'token', 'hasil', 'akun'], {
	featuredOnly: true,
});

export async function action({ request, context }: Route.ActionArgs) {
	return await actionSendEmailContact({
		request,
		context,
	});
}

export default function HubungiRoute({ loaderData }: Route.ComponentProps) {
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
							Hubungi Kito
						</Text>
						<Title>Mari bicarakan kebutuhan Anda</Title>
						<Text>
							Sampaikan pertanyaan, masukan, atau kebutuhan Anda. Kito akan membantu
							mengarahkan Anda ke langkah berikutnya.
						</Text>
					</Banner>

					<Container
						size="lg"
						mt={-80}
					>
						<Grid
							gap="xl"
							align="stretch"
						>
							{/* Left Column: Contact info */}
							<Grid.Col span={{ base: 12, md: 4 }}>
								<Card
									shadow="md"
									padding="xl"
									radius="xl"
									withBorder
									bg="white"
									h="100%"
								>
									<Title
										order={2}
										mb="md"
									>
										Kontak Kito
									</Title>
									<Text
										c="gray.6"
										mb="xl"
									>
										Untuk pertanyaan umum, masukan produk, atau kerja sama,
										kirim pesan melalui email atau formulir ini.
									</Text>

									<Stack>
										<Group
											align="flex-start"
											wrap="nowrap"
										>
											<ThemeIcon
												size={44}
												variant="light"
												style={{ flexShrink: 0 }}
											>
												<FiMail size={20} />
											</ThemeIcon>
											<Stack gap={4}>
												<Text
													span
													fw={700}
													size="sm"
												>
													Email Resmi
												</Text>
												<Anchor
													href="mailto:info@karsakito.web.id"
													size="sm"
													underline="hover"
												>
													info@karsakito.web.id
												</Anchor>
											</Stack>
										</Group>

										<Group
											align="flex-start"
											wrap="nowrap"
										>
											<ThemeIcon
												size={44}
												variant="light"
												style={{ flexShrink: 0 }}
											>
												<FiMapPin size={20} />
											</ThemeIcon>
											<Stack gap={4}>
												<Text
													span
													fw={700}
													size="sm"
												>
													Wilayah layanan
												</Text>
												<Text
													size="sm"
													c="gray.6"
												>
													Indonesia
												</Text>
											</Stack>
										</Group>
									</Stack>
								</Card>
							</Grid.Col>

							{/* Right Column: Form */}
							<Grid.Col span={{ base: 12, md: 8 }}>
								<Card
									shadow="md"
									padding="xl"
									radius="xl"
									withBorder
									bg="white"
								>
									<Title
										order={2}
										mb="xs"
									>
										Kirim Pesan
									</Title>
									<Text
										c="gray.6"
										mb="lg"
									>
										Isi formulir berikut. Kito akan meninjau pesan Anda dan
										menghubungi kembali melalui email.
									</Text>

									<FormContact />
								</Card>
							</Grid.Col>
						</Grid>
					</Container>
				</Box>

				<Box
					pos="relative"
					component="section"
					id="faq"
					aria-labelledby="faq-title-hubungi"
					py={{
						base: 48,
						sm: 60,
						lg: 80,
					}}
					className="z-20"
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
								id="faq-title-hubungi"
								order={2}
							>
								Pertanyaan yang sering ditanyakan
							</Title>
							<Text>Temukan jawaban singkat sebelum menghubungi Kito.</Text>
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
