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
import { metaPublicRoute } from '~app-modules/meta';
import { cfContext } from '~app-server/context';
import { actionSendEmailContact } from '~app-server/email';
import { authGetSession } from '~app-server/session';
import FormContact from '~app-ui/form/contact';
import Banner from '~app-ui/layouts/banner';
import { Header } from '~app-ui/layouts/header';

import type { Route } from './+types/hubungi';

export async function loader({ request, context }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	return {
		user,
		noIndex: cfContext(context).env.NODE_ENV !== 'production',
	};
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaPublicRoute({
		title: 'Hubungi KarsaKito',
		noIndex: loaderData.noIndex,
	});
}

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
			<main className="site-main">
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
							Hubungi Kami
						</Text>
						<Title>Mari Bicara dengan Kami</Title>
						<Text>
							Kami percaya pelestarian budaya dimulai dari kolaborasi yang erat.
							Beritahu kami kebutuhan Anda, kami senang menjadi bagian dari kesuksesan
							Anda.
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
										Info Kontak
									</Title>
									<Text
										c="gray.6"
										mb="xl"
									>
										Jangan ragu untuk menghubungi kami melalui detail di bawah
										ini atau mengisi formulir kontak.
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
													target="_blank"
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
													Alamat Kantor
												</Text>
												<Text
													size="sm"
													c="gray.6"
												>
													KarsaKito, Indonesia
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
										Isi formulir berikut dan tim kami akan segera menghubungi
										Anda kembali dalam waktu 1x24 jam.
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
		</div>
	);
}
