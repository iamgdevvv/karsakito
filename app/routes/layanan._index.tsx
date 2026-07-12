import { Container, Grid, Image, Text, Badge, Button, Title, Box, Group } from '@mantine/core';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { Link } from 'react-router';
import { authGetSession } from '~app-server/session';
import { Header } from '~app-ui/layouts/header';
import { cloudflareContext } from '~workers/app';

import type { Route } from './+types/layanan._index';

const services = [
	{
		id: 'karsalingo',
		title: 'KarsaLingo',
		description:
			'Platform media pembelajaran bahasa daerah interaktif yang dilengkapi dengan evaluasi AI untuk mendukung proses belajar mengajar secara mandiri dan terukur.',
		image: '/images/logo/Karsa_Lingo.png',
		badge: 'Pembelajaran',
	},
	{
		id: 'karsawriter',
		title: 'KarsaWriter',
		description:
			'Asisten cerdas berbasis AI untuk membantu Anda menyusun dan menciptakan karya tulis berbahasa daerah dengan struktur bahasa yang tepat dan natural.',
		image: '/images/logo/Karsa_Writer.png',
		badge: 'Produktivitas',
	},
	{
		id: 'karsalator',
		title: 'KarsaLator',
		description:
			'Layanan penerjemahan bahasa daerah yang akurat dengan mempertimbangkan konteks budaya setempat, sehingga hasil terjemahan tidak kaku dan lebih relevan.',
		image: '/images/logo/Karsa_Lator.png',
		badge: 'Penerjemahan',
	},
	{
		id: 'karsalisa',
		title: 'KarsaLisa',
		description:
			'Fitur unggulan untuk melakukan analisis tingkat kesopanan (unggah-ungguh) dan konteks budaya dalam penggunaan bahasa daerah Anda.',
		image: '/images/logo/Karsa_Lisa.png',
		badge: 'Analisis',
	},
	{
		id: 'karsapedia',
		title: 'KarsaPedia',
		description:
			'Ensiklopedia budaya daerah yang komprehensif, mendokumentasikan warisan adat, sejarah, tradisi, dan filosofi lokal untuk generasi masa depan.',
		image: '/images/logo/Karsa_Pedia.png',
		badge: 'Ensiklopedia',
	},
	{
		id: 'karsafrase',
		title: 'KarsaFrase',
		description:
			'Asisten cerdas yang didesain khusus untuk memparafrase dan menyusun ulang kalimat agar terdengar lebih natural sesuai dengan gaya bahasa penutur asli.',
		image: '/images/logo/Karsa_Frasee.png',
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

export default function LayananIndex({ loaderData }: Route.ComponentProps) {
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
					{/* Hero Section */}
					<Box
						bg="linear-gradient(135deg, var(--mantine-color-blue-9) 0%, var(--mantine-color-blue-6) 100%)"
						pt={{ base: 100, md: 140 }}
						pb={{ base: 120, md: 200 }}
						c="white"
					>
						<Container size="lg">
							<Grid
								align="center"
								gap={60}
							>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Badge
										color="white"
										c="blue"
										variant="filled"
										size="lg"
										mb="md"
										radius="xl"
									>
										Ekosistem KarsaKito
									</Badge>
									<Title
										order={1}
										size="3.5rem"
										fw={900}
										mb="lg"
										style={{ lineHeight: 1.1 }}
									>
										Solusi Cerdas untuk Warisan Budaya
									</Title>
									<Text
										size="xl"
										opacity={0.9}
										mb="xl"
										maw={500}
									>
										Hubungkan seluruh kebutuhan pembelajaran dan produktivitas
										bahasa daerah Anda ke dalam satu platform AI terpadu.
									</Text>
									<Button
										size="xl"
										color="white"
										c="blue"
										radius="xl"
										rightSection={<MdOutlineArrowForwardIos size={16} />}
									>
										Eksplorasi Layanan
									</Button>
								</Grid.Col>
								<Grid.Col span={{ base: 12, md: 6 }}>
									<Box
										bg="white"
										style={{
											borderRadius: '2rem',
											aspectRatio: '4/3',
											boxShadow: '0 30px 60px rgba(0,0,0,0.2)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											position: 'relative',
											overflow: 'hidden',
										}}
									>
										<Image
											src="/images/logo/Logo_KarsaKito.png"
											w="65%"
											style={{
												filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))',
												transform: 'scale(1.05)',
											}}
										/>
									</Box>
								</Grid.Col>
							</Grid>
						</Container>
					</Box>

					{/* Zig-Zag Sections (Overlapping Hero) */}
					<Box
						style={{ position: 'relative', zIndex: 10 }}
						mt={{ base: -60, md: -120 }}
					>
						{services.map((service, index) => {
							const isEven = index % 2 === 0;
							return (
								<Box
									key={service.id}
									bg={isEven ? 'white' : 'gray.0'}
									py={{ base: 60, md: 100 }}
									style={
										index === 0
											? {
													borderTopLeftRadius: '3rem',
													borderTopRightRadius: '3rem',
													boxShadow: '0 -20px 50px rgba(0,0,0,0.1)',
												}
											: {}
									}
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
												<Box
													style={{
														position: 'relative',
														display: 'flex',
														justifyContent: 'center',
														alignItems: 'center',
														minHeight: 350,
													}}
												>
													{/* Decorative Background Blob */}
													<Box
														bg={isEven ? 'blue.0' : 'white'}
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
														w={280}
														fit="contain"
														style={{
															zIndex: 1,
															filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.08))',
														}}
													/>
												</Box>
											</Grid.Col>

											{/* Content Column */}
											<Grid.Col
												span={{ base: 12, md: 6 }}
												order={{ base: 2, md: isEven ? 2 : 1 }}
											>
												<Badge
													color="blue"
													variant="light"
													size="lg"
													mb="sm"
													radius="sm"
												>
													{service.badge}
												</Badge>
												<Title
													order={2}
													size="2.5rem"
													fw={800}
													mb="md"
													c="dark.8"
													style={{ lineHeight: 1.2 }}
												>
													{service.title}
												</Title>
												<Text
													size="lg"
													c="dimmed"
													mb="xl"
													style={{ lineHeight: 1.7 }}
												>
													{service.description}
												</Text>
												<Group>
													<Button
														component={Link}
														to={`/layanan/${service.id}`}
														variant="filled"
														color="blue"
														size="md"
														radius="xl"
														rightSection={
															<MdOutlineArrowForwardIos size={12} />
														}
													>
														Pelajari {service.title}
													</Button>
												</Group>
											</Grid.Col>
										</Grid>
									</Container>
								</Box>
							);
						})}
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
				</Box>
			</main>
		</div>
	);
}
