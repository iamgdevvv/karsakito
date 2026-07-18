import { Carousel } from '@mantine/carousel';
import { Accordion, Badge, Box, Container, Grid, Group, Stack, Text, Title } from '@mantine/core';
import { LuArrowUpRight } from 'react-icons/lu';
import { getPublicFaqs } from '~app-modules/faqs';
import { metaPublicRoute } from '~app-modules/meta';
import { cfContext } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import { Image } from '~app-ui/components/image';
import { ButtonLink } from '~app-ui/components/link';
import { TestimonialCard } from '~app-ui/components/testimonial';
import Banner from '~app-ui/layouts/banner';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';
import type { KarsaAppsCategory } from '~generated/prisma/enums';

import type { Route } from './+types/layanan._index';

const services = [
	{
		id: 'karsawriter',
		title: 'KarsaWriter',
		description: 'Susun draf teks dengan topik, tujuan, audiens, dan gaya yang lebih jelas.',
		image: '/images/logo/logo-karsawriter.svg',
		badge: 'Produktivitas',
		visible: true,
	},
	{
		id: 'karsalator',
		title: 'KarsaLator',
		description:
			'Terjemahkan teks, lalu tinjau dan sesuaikan hasilnya dengan konteks penggunaan.',
		image: '/images/logo/logo-karsalator.svg',
		badge: 'Penerjemahan',
		visible: true,
	},
	{
		id: 'karsalisa',
		title: 'KarsaLisa',
		description:
			'Tinjau pilihan bahasa dan konteks penggunaan agar komunikasi Anda lebih sesuai kebutuhan.',
		image: '/images/logo/logo-karsalisa.svg',
		badge: 'Analisis',
		visible: true,
	},
	{
		id: 'karsafrase',
		title: 'KarsaFrase',
		description:
			'Susun ulang teks tanpa mengubah inti pesan agar lebih ringkas, jelas, atau sesuai gaya yang Anda pilih.',
		image: '/images/logo/logo-karsafrase.svg',
		badge: 'Penulisan',
		visible: true,
	},
	{
		id: 'karsapedia',
		title: 'KarsaPedia',
		description:
			'Dalam pengembangan sebagai ruang pengetahuan untuk membantu pencarian informasi seputar Bahasa Nusantara.',
		image: '/images/logo/logo-karsapedia.svg',
		badge: 'Roadmap',
		visible: false,
	},
	{
		id: 'karsalingo',
		title: 'KarsaLingo',
		description:
			'Dalam pengembangan untuk mendukung proses belajar Bahasa Nusantara melalui pengalaman yang lebih terarah.',
		image: '/images/logo/logo-karsalingo.svg',
		badge: 'Roadmap',
		visible: false,
	},
] as const satisfies {
	id: KarsaAppsCategory | 'karsalingo';
	title: string;
	description: string;
	image: string;
	badge: string;
	visible: boolean;
}[];

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
		title: 'Layanan KarsaKito',
		description:
			'Pilih tool KarsaKito untuk membantu menyusun, menyempurnakan, menerjemahkan, dan mengolah teks berbasis Bahasa Nusantara.',
		noIndex: loaderData.noIndex,
	});
}

const testimonials = [
	{
		quote: 'Mulai dari topik dan tujuan untuk menyusun draf caption, naskah, atau ide konten yang dapat disesuaikan lagi.',
		name: 'Kreator konten',
		position: 'Ilustrasi pengalaman Pengguna',
	},
	{
		quote: 'Gunakan hasil sebagai titik awal untuk merangkum, menyusun ulang, atau menyesuaikan teks sebelum dipakai dalam tugas.',
		name: 'Pelajar dan mahasiswa',
		position: 'Ilustrasi pengalaman Pengguna',
	},
	{
		quote: 'Siapkan draf komunikasi dengan tujuan dan audiens yang jelas, lalu tinjau kembali sebelum dibagikan.',
		name: 'Humas dan organisasi',
		position: 'Ilustrasi pengalaman Pengguna',
	},
	{
		quote: 'Terjemahkan atau tinjau pilihan bahasa sebagai bahan kerja, lalu sesuaikan hasilnya dengan konteks dan pengetahuan Anda.',
		name: 'Pengguna Bahasa Nusantara',
		position: 'Ilustrasi pengalaman Pengguna',
	},
];

const faqs = getPublicFaqs(['layanan', 'hasil', 'token'], {
	featuredOnly: true,
});

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
							Tool Produktivitas
						</Text>
						<Title>Selesaikan pekerjaan berbasis bahasa dengan lebih terarah</Title>
						<Text>
							Pilih tool sesuai kebutuhan, isi parameter yang relevan, lalu gunakan
							hasilnya sebagai draf untuk melanjutkan pekerjaan.
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
													c={!service.visible ? 'dark.2' : undefined}
												>
													{service.title}
													{!service.visible ? (
														<Text
															component="sup"
															fz={10}
															fw={700}
															top="-1em"
															c="primary"
														>
															{' '}
															(Segera)
														</Text>
													) : null}
												</Title>
												<Text>{service.description}</Text>
												{service.visible ? (
													<Group
														mt="xl"
														gap="xs"
													>
														<ButtonLink
															to="/"
															rightSection={
																<LuArrowUpRight size={18} />
															}
														>
															Gunakan {service.title}
														</ButtonLink>
														<ButtonLink
															to="/biaya-layanan"
															variant="subtle"
														>
															Lihat Tarif Token
														</ButtonLink>
													</Group>
												) : null}
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
									Suara Pengguna
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
								{testimonials.map((story, index) => (
									<Carousel.Slide key={`illustrative-story-${index}`}>
										<TestimonialCard
											h="100%"
											data={story}
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
								<Title order={2}>Pertanyaan yang sering ditanyakan</Title>
								<Text>
									Kenali cara kerja KarsaKito, penggunaan Token, dan langkah awal
									untuk memulai.
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
