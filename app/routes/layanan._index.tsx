import { Carousel } from '@mantine/carousel';
import { Accordion, Badge, Box, Container, Grid, Group, Stack, Text, Title } from '@mantine/core';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { metaPublicRoute } from '~app-modules/meta';
import { authGetSession } from '~app-server/session';
import { Image } from '~app-ui/components/image';
import { ButtonLink } from '~app-ui/components/link';
import { TestimonialCard } from '~app-ui/components/testimonial';
import Banner from '~app-ui/layouts/banner';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';
import { cloudflareContext } from '~workers/app';

import type { Route } from './+types/layanan._index';

const services = [
	{
		id: 'karsalingo',
		title: 'KarsaLingo',
		description:
			'Platform media pembelajaran bahasa daerah interaktif yang dilengkapi dengan evaluasi AI untuk mendukung proses belajar mengajar secara mandiri dan terukur.',
		image: '/images/logo/logo-karsalingo.svg',
		badge: 'Pembelajaran',
	},
	{
		id: 'karsawriter',
		title: 'KarsaWriter',
		description:
			'Asisten cerdas berbasis AI untuk membantu Anda menyusun dan menciptakan karya tulis berbahasa daerah dengan struktur bahasa yang tepat dan natural.',
		image: '/images/logo/logo-karsawriter.svg',
		badge: 'Produktivitas',
	},
	{
		id: 'karsalator',
		title: 'KarsaLator',
		description:
			'Layanan penerjemahan bahasa daerah yang akurat dengan mempertimbangkan konteks budaya setempat, sehingga hasil terjemahan tidak kaku dan lebih relevan.',
		image: '/images/logo/logo-karsalator.svg',
		badge: 'Penerjemahan',
	},
	{
		id: 'karsalisa',
		title: 'KarsaLisa',
		description:
			'Fitur unggulan untuk melakukan analisis tingkat kesopanan (unggah-ungguh) dan konteks budaya dalam penggunaan bahasa daerah Anda.',
		image: '/images/logo/logo-karsalisa.svg',
		badge: 'Analisis',
	},
	{
		id: 'karsapedia',
		title: 'KarsaPedia',
		description:
			'Ensiklopedia budaya daerah yang komprehensif, mendokumentasikan warisan adat, sejarah, tradisi, dan filosofi lokal untuk generasi masa depan.',
		image: '/images/logo/logo-karsapedia.svg',
		badge: 'Ensiklopedia',
	},
	{
		id: 'karsafrase',
		title: 'KarsaFrase',
		description:
			'Asisten cerdas yang didesain khusus untuk memparafrase dan menyusun ulang kalimat agar terdengar lebih natural sesuai dengan gaya bahasa penutur asli.',
		image: '/images/logo/logo-karsafrase.svg',
		badge: 'Penulisan',
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
		title: 'Layanan KarsaKito',
		noIndex: loaderData.noIndex,
	});
}

const testimonials = [
	{
		quote: "The platform significantly streamlined our content creation workflow while preserving the authenticity of local cultural values. It's intuitive, fast, and delivers consistently high-quality results.",
		name: 'Sarah Wijaya',
		position: 'Head of Communications, Nusantara Creative Hub',
	},
	{
		quote: 'We reduced the time needed to prepare educational materials from hours to minutes. This has become an essential tool for our teaching activities.',
		name: 'Ahmad Pratama',
		position: 'Lecturer, Faculty of Cultural Studies',
	},
	{
		quote: 'The AI-generated content feels natural and contextually relevant. It has helped our team produce more engaging campaigns with far less effort.',
		name: 'Michelle Tan',
		position: 'Digital Marketing Manager',
	},
	{
		quote: 'As a content creator, I appreciate how easy it is to generate ideas and polished drafts without losing my own creative voice.',
		name: 'Rizky Saputra',
		position: 'Content Creator',
	},
	{
		quote: 'This solution enables us to promote regional culture more effectively while maintaining accuracy and consistency across our digital channels.',
		name: 'Dewi Lestari',
		position: 'Public Relations Officer, Regional Tourism Office',
	},
	{
		quote: 'The user experience is clean and straightforward, making it accessible even for team members with minimal technical experience.',
		name: 'Kevin Hartono',
		position: 'Product Manager',
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

export default function LayananRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<Header authUser={loaderData.user} />
			<main className="site-main">
				<Box
					style={{
						minHeight: '100vh',
						overflow: 'hidden',
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Banner background="/images/karsakito-beranda-banner.jpg">
						<Text
							span
							size="xs"
							fw={700}
							c="primary"
							tt="uppercase"
						>
							Ekosistem KarsaKito
						</Text>
						<Title>Solusi Cerdas untuk Warisan Budaya</Title>
						<Text>
							Hubungkan seluruh kebutuhan pembelajaran dan produktivitas bahasa daerah
							Anda ke dalam satu platform AI terpadu.
						</Text>
					</Banner>

					{/* Zig-Zag Sections (Overlapping Hero) */}
					<Box>
						{services.map((service, index) => {
							const isEven = index % 2 === 0;
							return (
								<Box
									key={`${service.id}-${index}`}
									bg={isEven ? 'white' : 'gray.0'}
									py={{
										base: 48,
										sm: 60,
										md: 80,
										lg: 120,
									}}
								>
									<Container size="lg">
										<Grid
											align="center"
											gap={80}
										>
											{/* Image Column */}
											<Grid.Col
												span={{ base: 12, md: 6 }}
												order={{ base: 1, md: isEven ? 1 : 2 }}
											>
												<Group
													pos="relative"
													mih={320}
													justify="center"
												>
													{/* Decorative Background Blob */}
													<Box
														bg={isEven ? 'primary.0' : 'white'}
														style={{
															position: 'absolute',
															width: '80%',
															height: '100%',
															borderRadius: isEven
																? '60% 40% 30% 70% / 60% 30% 70% 40%'
																: '40% 60% 70% 30% / 40% 50% 60% 50%',
															zIndex: 0,
														}}
													/>
													<Image
														src={service.image}
														alt={service.title}
														w="auto"
														h={80}
														objectFit="contain"
														className="animate-pulse"
														style={{
															zIndex: 1,
															filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.08))',
														}}
													/>
												</Group>
											</Grid.Col>

											{/* Content Column */}
											<Grid.Col
												span={{ base: 12, md: 6 }}
												order={{ base: 2, md: isEven ? 2 : 1 }}
											>
												<Badge
													variant="light"
													size="xl"
													fz="xs"
													mb="sm"
												>
													{service.badge}
												</Badge>
												<Title
													order={2}
													mb="md"
												>
													{service.title}
												</Title>
												<Text mb="xl">{service.description}</Text>
												<ButtonLink
													to={`/layanan/${service.id}`}
													rightSection={
														<MdOutlineArrowForwardIos size={12} />
													}
												>
													Pelajari {service.title}
												</ButtonLink>
											</Grid.Col>
										</Grid>
									</Container>
								</Box>
							);
						})}
					</Box>

					<Box
						pos="relative"
						component="section"
						bg="white"
						py={{
							base: 48,
							sm: 60,
							lg: 80,
						}}
						className="z-20"
					>
						<Container>
							<Stack
								gap="sm"
								w="100%"
								maw={600}
								mx="auto"
								ta="center"
								align="center"
							>
								<Badge
									variant="light"
									size="lg"
									fz={10}
									fw={500}
								>
									Community Voice
								</Badge>
								<Title order={2}>Apa Kata Mereka Tentang KarsaKito?</Title>
							</Stack>
							<Carousel
								slideSize="50%"
								slideGap={{
									base: 'md',
									lg: 'lg',
								}}
								w="100%"
								mt="xl"
								withControls={false}
								withIndicators
								classNames={{
									indicators: 'static! mt-8',
									indicator:
										'border border-primary bg-primary-4! [&[data-active]]:bg-primary!',
								}}
							>
								{testimonials.map((testimonial, index) => (
									<Carousel.Slide key={`testimonial-${index}`}>
										<TestimonialCard
											h="100%"
											data={testimonial}
										/>
									</Carousel.Slide>
								))}
							</Carousel>
						</Container>
					</Box>

					<Box
						pos="relative"
						component="section"
						bg="gray.0"
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
									Everything you need to know about the product and other
									information.
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
				</Box>
			</main>
			<Footer />
		</div>
	);
}
