import { Badge, Box, Container, Grid, Group, Text, Title } from '@mantine/core';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { metaPublicRoute } from '~app-modules/meta';
import { authGetSession } from '~app-server/session';
import { Image } from '~app-ui/components/image';
import { ButtonLink } from '~app-ui/components/link';
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
				</Box>
			</main>
			<Footer />
		</div>
	);
}
