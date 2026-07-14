import {
	Badge,
	Button,
	Card,
	Container,
	Grid,
	SimpleGrid,
	Stack,
	Text,
	Title,
	rem,
	Group,
	Box,
	ThemeIcon,
	Image,
	Paper,
	RingProgress,
	Blockquote,
	Avatar,
} from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import { FiZap, FiHeart, FiUsers, FiTarget, FiArrowRight, FiCheckCircle, FiInfo, FiMessageSquare } from 'react-icons/fi';
import { metaPublicRoute } from '~app-modules/meta';
import { cfContext } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';
import Banner from '~app-ui/layouts/banner';
import { AnimatedStat } from '~app-ui/components/AnimatedStat';
import { TeamMemberCard } from '~app-ui/components/TeamMemberCard';

import type { Route } from './+types/tentang';

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
		title: 'Tentang KarsaKito | Menjembatani Budaya & Teknologi',
		description:
			'Kenali KarsaKito lebih dekat. Misi kami adalah melestarikan dan memberdayakan bahasa daerah melalui teknologi kecerdasan buatan.',
		noIndex: loaderData.noIndex,
	});
}

function AnimatedCounter({
	target,
	prefix = '',
	suffix = '',
	duration = 2000,
}: {
	target: number;
	prefix?: string;
	suffix?: string;
	duration?: number;
}) {
	const [count, setCount] = useState(0);
	const [hasStarted, setHasStarted] = useState(false);
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !hasStarted) {
					setHasStarted(true);
				}
			},
			{ threshold: 0.5 },
		);
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, [hasStarted]);

	useEffect(() => {
		if (!hasStarted) return;
		let startTimestamp: number | null = null;
		const step = (timestamp: number) => {
			if (!startTimestamp) startTimestamp = timestamp;
			const progress = Math.min((timestamp - startTimestamp) / duration, 1);
			const easeProgress = 1 - Math.pow(1 - progress, 4);
			setCount(Math.floor(easeProgress * target));
			if (progress < 1) {
				window.requestAnimationFrame(step);
			} else {
				setCount(target);
			}
		};
		window.requestAnimationFrame(step);
	}, [hasStarted, target, duration]);

	return (
		<span ref={ref}>
			{prefix}
			{count}
			{suffix}
		</span>
	);
}

export default function TentangPage({ loaderData }: Route.ComponentProps) {
	return (
		<div style={{ backgroundColor: '#ffffff', minHeight: '100vh', overflowX: 'hidden' }}>
			<Header authUser={loaderData.user} />

			{/* 1. HERO SECTION */}
			<Banner background="/images/karsakito-beranda-banner.jpg">
				<Text span size="xs" fw={700} c="primary" tt="uppercase">
					Tentang Kami
				</Text>
				<Title>Menjembatani Budaya dan Teknologi Masa Depan.</Title>
				<Text>
					KarsaKito hadir untuk memastikan warisan bahasa dan budaya lokal tidak hanya menjadi cerita usang di masa lalu, tetapi terus hidup dan berdampak nyata dalam keseharian kita di era digital.
				</Text>
				<Group mt="xl">
					<Button 
						size="lg" 
						radius="xl" 
						color="blue.6" 
						rightSection={<FiArrowRight />}
						component="a"
						href="/layanan"
					>
						Lihat Layanan Kami
					</Button>
				</Group>
			</Banner>

			{/* 2. VALIDATION STATS */}
			<section className="py-24 border-y border-slate-100 bg-slate-50">
				<Container size="lg">
					<Stack align="center" mb={50}>
						<Text fw={700} c="blue.6" tt="uppercase" style={{ letterSpacing: rem(1.5) }}>
							Validation Stats
						</Text>
						<Title order={2} size="h1" fw={800} c="slate.9" ta="center">
							Dukungan Nyata dari Masyarakat
						</Title>
					</Stack>
					<SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
						<AnimatedStat target={94} color="blue.6" label="Responden setuju AI penting untuk budaya." />
						<AnimatedStat target={82} color="red.5" label="Kesulitan mencari media belajar modern." />
						<AnimatedStat target={91} color="teal.5" label="Tertarik menggunakan platform KarsaKito." />
					</SimpleGrid>
				</Container>
			</section>

			{/* 3. NARRATIVE STORYTELLING */}
			<section className="py-24 md:py-32 bg-white">
				<Container size="lg">
					<Stack align="center" mb={60}>
						<Text fw={700} c="blue.6" tt="uppercase" style={{ letterSpacing: rem(1.5) }}>
							Narrative Storytelling
						</Text>
						<Title order={2} size="h1" fw={800} c="slate.9" ta="center">
							Perjalanan Menjaga Warisan
						</Title>
					</Stack>

					<Grid gutter={80} align="stretch">
						<Grid.Col span={{ base: 12, md: 6 }}>
							<Paper shadow="sm" p="xl" radius="lg" withBorder h="100%" style={{ borderColor: '#e2e8f0', display: 'flex', flexDirection: 'column' }}>
								<Group align="center" gap="sm" mb="xl">
									<ThemeIcon size="lg" radius="xl" color="red.5" variant="light">
										<FiInfo size={20} />
									</ThemeIcon>
									<Title order={3} fw={800} c="slate.9">The Problem</Title>
								</Group>
								<Blockquote color="red.5" cite="– Language Shift & The Invisible Loss" iconSize={0} radius="sm" mt="auto" style={{ fontSize: '1.1rem', lineHeight: 1.8, fontStyle: 'italic', color: '#475569', padding: 0 }}>
									Ketika sebuah bahasa daerah berhenti dituturkan oleh anak muda, kita tidak hanya kehilangan deretan kosakata. Kita kehilangan sebuah <strong>"wadah pengetahuan"</strong>. Pergeseran bahasa ini perlahan memutus transmisi antargenerasi, menghapus filosofi adat yang tak pernah tertulis dalam buku mana pun.
								</Blockquote>
							</Paper>
						</Grid.Col>
						
						<Grid.Col span={{ base: 12, md: 6 }}>
							<Paper shadow="sm" p="xl" radius="lg" withBorder h="100%" style={{ borderColor: '#e2e8f0', display: 'flex', flexDirection: 'column' }}>
								<Group align="center" gap="sm" mb="xl">
									<ThemeIcon size="lg" radius="xl" color="blue.6" variant="light">
										<FiTarget size={20} />
									</ThemeIcon>
									<Title order={3} fw={800} c="slate.9">The Mission</Title>
								</Group>
								<Blockquote color="blue.6" cite="– Digital Documentation & Revitalization" iconSize={0} radius="sm" mt="auto" style={{ fontSize: '1.1rem', lineHeight: 1.8, fontStyle: 'italic', color: '#475569', padding: 0 }}>
									Misi kami adalah <strong>revitalisasi linguistik</strong>: membangun fondasi digital agar bahasa daerah tidak lagi sekadar menjadi "warisan masa lalu" yang berdebu di museum, melainkan bertransformasi menjadi "alat bantu masa depan" yang tetap relevan digunakan di era <em>smartphone</em> dan kecerdasan buatan.
								</Blockquote>
							</Paper>
						</Grid.Col>
					</Grid>
				</Container>
			</section>

			{/* 3.5 IN THE NEWS */}
			<section className="py-24 bg-white border-y border-slate-100">
				<Container size="lg">
					<Stack align="center" mb={60}>
						<Text fw={700} c="blue.6" tt="uppercase" style={{ letterSpacing: rem(1.5) }}>
							Fakta & Realita
						</Text>
						<Title order={2} size="h1" fw={800} c="slate.9" ta="center">
							Mengapa Ini Sangat Mendesak?
						</Title>
					</Stack>

					<Stack gap={80}>
						{/* Article 1 - Image Left */}
						<Grid gutter={60} align="center">
							<Grid.Col span={{ base: 12, md: 5 }}>
								<Image
									src="https://cdn-jjmn.jawapos.com/images/14/2025/03/07/firdaus-1-2873277214.jpg"
									alt="Firdaus Abie"
									radius="xl"
									h={350}
									fit="cover"
									style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 7 }}>
								<Stack gap="md" align="flex-start">
									<Badge color="red.5" variant="light" size="xl">Ancaman Kepunahan</Badge>
									<Title order={3} fw={800} c="slate.9" style={{ lineHeight: 1.3, fontSize: '2rem' }}>
										"Bahasa Minang Terancam Punah, Perlu Langkah Nyata"
									</Title>
									<Text c="slate.6" size="lg" style={{ lineHeight: 1.7 }}>
										Data UNESCO menunjukkan lebih dari 2.500 bahasa di dunia telah punah, dan 100 di antaranya berasal dari Indonesia. Bahasa Minang kini masuk dalam kategori "Sangat Terancam". Fenomena ini mendorong pentingnya langkah konkret agar bahasa daerah tidak sekadar menjadi sejarah.
									</Text>
									<Button
										variant="subtle"
										color="blue.6"
										p={0}
										size="lg"
										component="a"
										href="https://padek.jawapos.com/sumbar/2503070049/bahasa-minang-terancam-punah-firdaus-abie-perlu-langkah-nyata-untuk-menjaganya"
										target="_blank"
										rightSection={<FiArrowRight />}
									>
										Baca selengkapnya di Padang Ekspres
									</Button>
								</Stack>
							</Grid.Col>
						</Grid>

						{/* Article 2 - Image Right */}
						<Grid gutter={60} align="center">
							<Grid.Col span={{ base: 12, md: 7 }} order={{ base: 2, md: 1 }}>
								<Stack gap="md" align="flex-start">
									<Badge color="green.5" variant="light" size="xl">Upaya Global</Badge>
									<Title order={3} fw={800} c="slate.9" style={{ lineHeight: 1.3, fontSize: '2rem' }}>
										"Proses Penominasian Pantun oleh UNESCO Libatkan Kerja Keras"
									</Title>
									<Text c="slate.6" size="lg" style={{ lineHeight: 1.7 }}>
										Sebagai bentuk pelestarian warisan budaya takbenda, tradisi lisan seperti pantun mendapat pengakuan global dari UNESCO. Hal ini membuktikan bahwa dokumentasi dan pelestarian sastra serta bahasa lokal memiliki urgensi dan relevansi di tingkat dunia.
									</Text>
									<Button
										variant="subtle"
										color="blue.6"
										p={0}
										size="lg"
										component="a"
										href="http://brin.go.id/news/122244/proses-penominasian-pantun-oleh-unesco-libatkan-kerja-keras-indonesia-malaysia"
										target="_blank"
										rightSection={<FiArrowRight />}
									>
										Baca selengkapnya di BRIN
									</Button>
								</Stack>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 5 }} order={{ base: 1, md: 2 }}>
								<Paper p="xl" radius="xl" bg="white" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 350, border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
									<Image
										src="https://brin.go.id/images/logo_brin.jpg"
										alt="BRIN Logo"
										fit="contain"
										style={{ maxWidth: '80%', maxHeight: '80%' }}
									/>
								</Paper>
							</Grid.Col>
						</Grid>

						{/* Article 3 - Image Left */}
						<Grid gutter={60} align="center">
							<Grid.Col span={{ base: 12, md: 5 }}>
								<Image
									src="https://cdn0-production-images-kly.akamaized.net/Ml3tUvgWSc6tcBUE-OB8ZhPsUf8=/1280x720/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/2983070/original/094311900_1575206384-IMG_20191201_174408.jpg"
									alt="Potensi Punah Bahasa Minang"
									radius="xl"
									h={350}
									fit="cover"
									style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
								/>
							</Grid.Col>
							<Grid.Col span={{ base: 12, md: 7 }}>
								<Stack gap="md" align="flex-start">
									<Badge color="orange.5" variant="light" size="xl">Krisis Waktu</Badge>
									<Title order={3} fw={800} c="slate.9" style={{ lineHeight: 1.3, fontSize: '2rem' }}>
										"Ancaman Serius Bahasa Minang: Berpotensi Punah dan Dilupakan"
									</Title>
									<Text c="slate.6" size="lg" style={{ lineHeight: 1.7 }}>
										Tanpa upaya sistematis dan pemanfaatan teknologi yang tepat, bahasa Minang berpotensi punah dalam beberapa dekade mendatang akibat minimnya penutur generasi muda. KarsaKito hadir sebagai infrastruktur digital untuk mencegah prediksi suram ini menjadi kenyataan.
									</Text>
									<Button
										variant="subtle"
										color="blue.6"
										p={0}
										size="lg"
										component="a"
										href="https://www.liputan6.com/regional/read/7732146/ancaman-serius-bahasa-minang-berpotensi-punah-dan-dilupakan"
										target="_blank"
										rightSection={<FiArrowRight />}
									>
										Baca selengkapnya di Liputan 6
									</Button>
								</Stack>
							</Grid.Col>
						</Grid>
					</Stack>
				</Container>
			</section>

			{/* 4. COMMUNITY VOICE (TESTIMONI) */}
			<section className="py-24 bg-slate-50 border-y border-slate-100">
				<Container size="lg">
					<Stack align="center" mb={60}>
						<Text fw={700} c="cyan.6" tt="uppercase" style={{ letterSpacing: rem(1.5) }}>
							Community Voice
						</Text>
						<Title order={2} size="h1" fw={800} c="slate.9" ta="center">
							Apa Kata Mereka Tentang KarsaKito?
						</Title>
					</Stack>

					<Grid gutter={60}>
						<Grid.Col span={{ base: 12, md: 6 }}>
							<Card shadow="sm" padding="xl" radius="lg" withBorder style={{ borderColor: '#e2e8f0', height: '100%' }}>
								<ThemeIcon size="xl" radius="xl" color="blue.6" variant="light" mb="lg">
									<FiMessageSquare size={24} />
								</ThemeIcon>
								<Text size="xl" fw={400} c="slate.7" style={{ lineHeight: 1.7, fontStyle: 'italic' }}>
									"Teknologi AI sangat membantu saya karena tidak ada media belajar modern untuk bahasa daerah saat ini."
								</Text>
								<Group mt="xl" gap="sm">
									<Avatar color="blue" radius="xl">RM</Avatar>
									<div>
										<Text fw={700} c="slate.9">Responden Masyarakat Umum</Text>
										<Text size="sm" c="slate.5">Survei KarsaKito</Text>
									</div>
								</Group>
							</Card>
						</Grid.Col>
						
						<Grid.Col span={{ base: 12, md: 6 }}>
							<Card shadow="sm" padding="xl" radius="lg" withBorder style={{ borderColor: '#e2e8f0', height: '100%' }}>
								<ThemeIcon size="xl" radius="xl" color="blue.6" variant="light" mb="lg">
									<FiMessageSquare size={24} />
								</ThemeIcon>
								<Text size="xl" fw={400} c="slate.7" style={{ lineHeight: 1.7, fontStyle: 'italic' }}>
									"Semangat dalam mengembangkan KarsaKito! Sangat berpotensi untuk generasi muda."
								</Text>
								<Group mt="xl" gap="sm">
									<Avatar color="cyan" radius="xl">RM</Avatar>
									<div>
										<Text fw={700} c="slate.9">Responden Mahasiswa</Text>
										<Text size="sm" c="slate.5">Survei KarsaKito</Text>
									</div>
								</Group>
							</Card>
						</Grid.Col>
					</Grid>
				</Container>
			</section>

			{/* 5. CLOSING (EDITORIAL) */}
			<section className="py-24 md:py-32 bg-white">
				<Container size="lg">
					<Grid align="center" gutter={80}>
						<Grid.Col span={{ base: 12, md: 6 }}>
							<Image
								src="/images/pinterestgambarpemudadaerah.jpg"
								alt="Pemuda Daerah"
								radius="md"
								style={{
									boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)',
									objectFit: 'cover'
								}}
							/>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 6 }}>
							<Stack gap="xl" pr={{ md: 'xl' }}>
								<Title order={2} size="h1" fw={800} c="slate.9" style={{ letterSpacing: '-0.03em', lineHeight: 1.2, fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
									Menulis Jejak untuk Masa Depan
								</Title>
								<Text size="lg" c="slate.6" style={{ lineHeight: 2, fontSize: '1.15rem' }}>
									Dalam 50 tahun ke depan, bagaimana bahasa kita akan diingat? KarsaKito lahir dari keresahan akan senyapnya warisan budaya di ruang digital.
								</Text>
								<Text size="lg" c="slate.6" style={{ lineHeight: 2, fontSize: '1.15rem' }}>
									Kami tidak hanya membangun aplikasi, kami sedang menuliskan jejak digital agar anak cucu kita kelak tidak asing dengan asal-usulnya. Karena bagi kami, melestarikan budaya adalah bentuk tertinggi dari mencintai tanah kelahiran.
								</Text>
							</Stack>
						</Grid.Col>
					</Grid>
				</Container>
			</section>

			{/* 6. TEAM */}
			<section className="py-24 bg-slate-50 border-t border-slate-100">
				<Container size="lg">
					<Stack align="center" mb={60}>
						<Text fw={700} c="blue.6" tt="uppercase" style={{ letterSpacing: rem(1.5) }}>
							Tim Kami
						</Text>
						<Title order={2} size="h1" fw={800} c="slate.9" ta="center">
							Orang-orang di Balik KarsaKito
						</Title>
					</Stack>

					<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
						<TeamMemberCard 
							name="Grafis Nuresa"
							role="Project Lead & Business Analyst"
							image={null}
							focus={['Strategi Produk', 'Validasi Bisnis']}
						/>
						<TeamMemberCard 
							name="Muhammad Attan"
							role="AI/Backend Developer"
							image="/images/attan.png"
							focus={['RAG Architecture', 'LLM & Knowledge Base']}
						/>
						<TeamMemberCard 
							name="Okyra Asyrafi G."
							role="UI/UX & Frontend"
							image={null}
							focus={['Antarmuka Pengguna', 'Workflow']}
						/>
						<TeamMemberCard 
							name="Pandu Pratama H."
							role="Frontend & Domain Expert"
							image="/images/pandu.png"
							focus={['Frontend Implementation', 'Cultural Validation']}
						/>
					</SimpleGrid>
				</Container>
			</section>

			{/* FOOTER */}
			<div className="border-t border-slate-200">
				<Footer />
			</div>
		</div>
	);
}
