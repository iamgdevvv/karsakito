import {
	Badge,
	Blockquote,
	Card,
	Container,
	Grid,
	Paper,
	SimpleGrid,
	Stack,
	Text,
	Title,
	rem,
	Group,
	Box,
	Divider,
	ThemeIcon,
} from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import { FiZap, FiShield, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { metaPublicRoute } from '~app-modules/meta';
import { authGetSession } from '~app-server/session';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';
import { cloudflareContext } from '~workers/app';

import type { Route } from './+types/tentang';

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
		title: 'Tentang Perusahaan | KarsaKito',
		description:
			'Pelajari identitas, nilai inti, dan visi besar KarsaKito dalam mentransformasi ekonomi kreatif Indonesia.',
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
		<div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', overflowX: 'hidden' }}>
			<Header authUser={loaderData.user} />

			{/* 1. THE "WHO WE ARE" HERO (Enterprise Dark Aesthetic) */}
			<section
				className="relative py-32 md:py-48"
				style={{
					backgroundColor: '#0f172a',
					backgroundImage: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 70%)',
					borderBottom: '1px solid #1e293b',
				}}
			>
				<Container
					size="lg"
					className="relative z-10"
				>
					<Stack
						align="center"
						gap="xl"
					>
						<Badge
							size="lg"
							variant="outline"
							color="blue.4"
							radius="sm"
							style={{
								letterSpacing: rem(2),
								backgroundColor: 'rgba(59, 130, 246, 0.1)',
							}}
						>
							TENTANG KARSAKITO
						</Badge>
						<Title
							order={1}
							fw={900}
							ta="center"
							style={{
								maxWidth: '900px',
								letterSpacing: '-0.02em',
								fontSize: 'clamp(3rem, 6vw, 5rem)',
								lineHeight: 1.1,
								color: '#ffffff',
							}}
						>
							Membangun Fondasi Digital untuk Budaya Indonesia.
						</Title>
						<Text
							size="xl"
							ta="center"
							style={{ maxWidth: '750px', lineHeight: 1.7, color: '#94a3b8' }}
							fw={300}
						>
							KarsaKito bukan sekadar platform pelestarian. Kami adalah perusahaan
							pengembang infrastruktur kecerdasan buatan terintegrasi yang
							memberdayakan bahasa dan budaya lokal menjadi aset ekonomi kreatif
							berskala global.
						</Text>
					</Stack>
				</Container>
			</section>

			{/* 2. KARSAKITO IN NUMBERS (Corporate Trust Statistics) */}
			<section
				className="py-16 md:py-24"
				style={{
					backgroundColor: '#ffffff',
					borderBottom: '1px solid #e2e8f0',
					boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
				}}
			>
				<Container size="lg">
					<SimpleGrid
						cols={{ base: 2, md: 4 }}
						spacing="xl"
						verticalSpacing="xl"
					>
						<Stack
							align="center"
							gap="xs"
						>
							<Text
								size="3.5rem"
								fw={900}
								c="blue.6"
								style={{ lineHeight: 1, letterSpacing: '-0.03em' }}
							>
								<AnimatedCounter target={6} />
							</Text>
							<Text
								fw={700}
								tt="uppercase"
								size="sm"
								c="slate.8"
								style={{ letterSpacing: rem(1) }}
							>
								Modul AI
							</Text>
							<Text
								size="sm"
								c="dimmed"
								ta="center"
							>
								Infrastruktur terintegrasi
							</Text>
						</Stack>
						<Stack
							align="center"
							gap="xs"
						>
							<Text
								size="3.5rem"
								fw={900}
								c="blue.6"
								style={{ lineHeight: 1, letterSpacing: '-0.03em' }}
							>
								<AnimatedCounter
									target={31}
									suffix="+"
								/>
							</Text>
							<Text
								fw={700}
								tt="uppercase"
								size="sm"
								c="slate.8"
								style={{ letterSpacing: rem(1) }}
							>
								Responden
							</Text>
							<Text
								size="sm"
								c="dimmed"
								ta="center"
							>
								Validasi pasar awal
							</Text>
						</Stack>
						<Stack
							align="center"
							gap="xs"
						>
							<Text
								size="3.5rem"
								fw={900}
								c="blue.6"
								style={{ lineHeight: 1, letterSpacing: '-0.03em' }}
							>
								<AnimatedCounter
									target={100}
									suffix="%"
								/>
							</Text>
							<Text
								fw={700}
								tt="uppercase"
								size="sm"
								c="slate.8"
								style={{ letterSpacing: rem(1) }}
							>
								Kurasi Adat
							</Text>
							<Text
								size="sm"
								c="dimmed"
								ta="center"
							>
								Akurasi konteks budaya
							</Text>
						</Stack>
						<Stack
							align="center"
							gap="xs"
						>
							<Text
								size="3.5rem"
								fw={900}
								c="blue.6"
								style={{ lineHeight: 1, letterSpacing: '-0.03em' }}
							>
								<AnimatedCounter
									target={1}
									prefix="#"
								/>
							</Text>
							<Text
								fw={700}
								tt="uppercase"
								size="sm"
								c="slate.8"
								style={{ letterSpacing: rem(1) }}
							>
								Pelopor AI
							</Text>
							<Text
								size="sm"
								c="dimmed"
								ta="center"
							>
								Bahasa Minangkabau
							</Text>
						</Stack>
					</SimpleGrid>
				</Container>
			</section>

			{/* 3. OUR VISION & THE THREAT (Split Layout) */}
			<section className="py-24 md:py-32">
				<Container size="lg">
					<Paper
						withBorder
						p={{ base: 'xl', md: 80 }}
						radius="xl"
						shadow="xl"
						style={{ overflow: 'hidden', backgroundColor: '#ffffff' }}
					>
						<Grid
							gap={80}
							align="center"
						>
							<Grid.Col span={{ base: 12, md: 6 }}>
								<Badge
									size="md"
									color="red.6"
									variant="light"
									mb="xl"
									style={{ letterSpacing: rem(1.5) }}
								>
									URGENSI MASALAH
								</Badge>
								<Title
									order={2}
									size="h1"
									fw={900}
									mb="xl"
									style={{
										lineHeight: 1.2,
										letterSpacing: '-0.02em',
										color: '#0f172a',
									}}
								>
									Teknologi Global Hadir, Namun Bahasa Daerah Tertinggal.
								</Title>
								<Text
									size="lg"
									c="slate.6"
									fw={400}
									style={{ lineHeight: 1.8 }}
								>
									Saat ini, AI mempercepat produktivitas dalam bahasa
									internasional. Tanpa dukungan teknologi serupa, bahasa daerah
									berisiko kehilangan relevansi dalam aktivitas digital
									sehari-hari. Jika dibiarkan, transfer pengetahuan budaya
									antargenerasi akan perlahan terputus. KarsaKito lahir secara
									eksklusif untuk menjembatani kesenjangan tersebut.
								</Text>
							</Grid.Col>

							<Grid.Col span={{ base: 12, md: 6 }}>
								<Box
									p="xl"
									style={{
										backgroundColor: '#f8fafc',
										borderRadius: '16px',
										borderLeft: '4px solid #2563eb',
									}}
								>
									<Text
										size="sm"
										fw={800}
										c="blue.7"
										tt="uppercase"
										mb="lg"
										style={{ letterSpacing: rem(1.5) }}
									>
										Visi Perusahaan
									</Text>
									<Blockquote
										color="blue"
										cite="– Manifestasi KarsaKito"
										radius="sm"
										p={0}
										style={{ border: 'none' }}
									>
										<Text
											size="xl"
											fw={500}
											c="slate.8"
											style={{ lineHeight: 1.6, fontStyle: 'italic' }}
										>
											"Mengubah paradigma: Budaya lokal bukan lagi sekadar
											sejarah untuk didokumentasikan, melainkan alat
											produktivitas yang digunakan secara aktif dalam
											penelitian, karya kreatif, dan industri digital masa
											depan."
										</Text>
									</Blockquote>
								</Box>
							</Grid.Col>
						</Grid>
					</Paper>
				</Container>
			</section>

			{/* 4. CORE VALUES (Replacing Ecosystem) */}
			<section
				className="py-24 md:py-32"
				style={{ backgroundColor: '#0f172a' }}
			>
				<Container size="lg">
					<Stack
						align="center"
						mb={80}
					>
						<Title
							order={2}
							size="h1"
							fw={900}
							ta="center"
							style={{ letterSpacing: '-0.02em', color: '#ffffff' }}
						>
							Nilai Inti KarsaKito
						</Title>
						<Text
							ta="center"
							size="xl"
							fw={300}
							style={{ maxWidth: '800px', color: '#94a3b8' }}
						>
							Pilar filosofis yang menjadi landasan setiap baris kode, model AI, dan
							keputusan bisnis yang kami ambil.
						</Text>
					</Stack>

					<SimpleGrid
						cols={{ base: 1, sm: 2 }}
						spacing="xl"
						verticalSpacing="xl"
					>
						{[
							{
								title: 'Inovasi Berkelanjutan',
								desc: 'Kami mempelopori arsitektur Retrieval-Augmented Generation (RAG) untuk memastikan efisiensi dan akurasi model bahasa berskala masif.',
								icon: <FiZap size={32} />,
							},
							{
								title: 'Integritas Budaya',
								desc: 'AI bukan pengganti pakar. Kami menerapkan mekanisme human-in-the-loop untuk menjaga kemurnian dan kesopanan konteks adat.',
								icon: <FiShield size={32} />,
							},
							{
								title: 'Ekonomi Kreatif',
								desc: 'Mentransformasi warisan lisan menjadi layanan profesional (B2B/B2C) yang memiliki potensi komersial tinggi di era ekonomi kreator.',
								icon: <FiTrendingUp size={32} />,
							},
							{
								title: 'Kolaborasi Inklusif',
								desc: 'Menyediakan ekosistem partisipatif bagi akademisi, institusi, dan pegiat budaya untuk bersama-sama mengkurasi pengetahuan nasional.',
								icon: <FiUsers size={32} />,
							},
						].map((val, i) => (
							<Card
								key={i}
								withBorder
								radius="xl"
								padding="xl"
								style={{
									background:
										'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
									borderColor: 'rgba(51, 65, 85, 0.5)',
									backdropFilter: 'blur(12px)',
									boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
								}}
								className="group transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)]"
							>
								<ThemeIcon
									size={64}
									radius="md"
									variant="gradient"
									gradient={{ from: 'blue.7', to: 'cyan.5', deg: 135 }}
									mb="xl"
									className="transition-transform duration-500 group-hover:scale-110"
								>
									{val.icon}
								</ThemeIcon>
								<Title
									order={3}
									size="h3"
									fw={800}
									mb="sm"
									style={{ color: '#f8fafc', letterSpacing: '-0.01em' }}
								>
									{val.title}
								</Title>
								<Text
									size="md"
									fw={400}
									style={{ lineHeight: 1.7, color: '#94a3b8' }}
								>
									{val.desc}
								</Text>
							</Card>
						))}
					</SimpleGrid>
				</Container>
			</section>

			{/* 5. MARKET READINESS & IMPACT */}
			<section
				className="py-24 md:py-32"
				style={{ backgroundColor: '#ffffff' }}
			>
				<Container size="lg">
					<Stack
						align="center"
						mb={80}
					>
						<Badge
							size="md"
							color="indigo"
							variant="light"
							mb="sm"
							style={{ letterSpacing: rem(1.5) }}
						>
							SKALA DAMPAK
						</Badge>
						<Title
							order={2}
							size="h1"
							fw={900}
							ta="center"
							style={{ letterSpacing: '-0.02em', color: '#0f172a' }}
						>
							Infrastruktur untuk Semua Sektor
						</Title>
					</Stack>

					<Grid gap="xl">
						<Grid.Col span={{ base: 12, md: 4 }}>
							<Paper
								p="xl"
								radius="lg"
								withBorder
								shadow="sm"
								style={{ height: '100%', backgroundColor: '#f8fafc' }}
							>
								<Text
									size="xs"
									fw={800}
									c="blue.6"
									mb="lg"
									tt="uppercase"
									style={{ letterSpacing: rem(1.5) }}
								>
									01 / Akademik
								</Text>
								<Title
									order={3}
									size="h4"
									fw={800}
									mb="md"
									c="slate.9"
								>
									Pelajar & Peneliti
								</Title>
								<Text
									size="sm"
									c="slate.6"
									style={{ lineHeight: 1.7 }}
								>
									Solusi riset, pengerjaan tugas, dan analisis sastra daerah
									secara presisi tanpa membuang waktu mencari referensi manual.
								</Text>
							</Paper>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 4 }}>
							<Paper
								p="xl"
								radius="lg"
								withBorder
								shadow="sm"
								style={{ height: '100%', backgroundColor: '#f8fafc' }}
							>
								<Text
									size="xs"
									fw={800}
									c="blue.6"
									mb="lg"
									tt="uppercase"
									style={{ letterSpacing: rem(1.5) }}
								>
									02 / Industri
								</Text>
								<Title
									order={3}
									size="h4"
									fw={800}
									mb="md"
									c="slate.9"
								>
									Kreator & Penulis
								</Title>
								<Text
									size="sm"
									c="slate.6"
									style={{ lineHeight: 1.7 }}
								>
									Akselerasi produksi konten naskah, pidato, dan artikel komersial
									dengan menjaga keaslian gaya bahasa lokal.
								</Text>
							</Paper>
						</Grid.Col>
						<Grid.Col span={{ base: 12, md: 4 }}>
							<Paper
								p="xl"
								radius="lg"
								withBorder
								shadow="sm"
								style={{ height: '100%', backgroundColor: '#f8fafc' }}
							>
								<Text
									size="xs"
									fw={800}
									c="blue.6"
									mb="lg"
									tt="uppercase"
									style={{ letterSpacing: rem(1.5) }}
								>
									03 / B2B & Publik
								</Text>
								<Title
									order={3}
									size="h4"
									fw={800}
									mb="md"
									c="slate.9"
								>
									Institusi & Pemerintah
								</Title>
								<Text
									size="sm"
									c="slate.6"
									style={{ lineHeight: 1.7 }}
								>
									Digitalisasi arsip museum dan integrasi layanan publik daerah
									melalui kapabilitas API bahasa dari KarsaKito.
								</Text>
							</Paper>
						</Grid.Col>
					</Grid>
				</Container>
			</section>

			{/* 6. TIM PENGEMBANG (Technical Practitioners) */}
			<section
				className="py-24 md:py-32"
				style={{ backgroundColor: '#f8f9fa' }}
			>
				<Container size="lg">
					<Title
						order={2}
						size="h1"
						fw={900}
						ta="center"
						mb="md"
						style={{ letterSpacing: '-0.02em', color: '#0f172a' }}
					>
						Tim Pengembang KarsaKito
					</Title>
					<Text
						ta="center"
						size="lg"
						fw={400}
						style={{ maxWidth: '800px', margin: '0 auto 80px', color: '#64748b' }}
					>
						Kolaborasi talenta teknis dan pakar domain budaya yang mendedikasikan
						keahliannya untuk membangun infrastruktur AI bahasa daerah.
					</Text>

					<SimpleGrid
						cols={{ base: 1, sm: 2, lg: 4 }}
						spacing="xl"
					>
						{[
							{
								name: 'Grafis Nuresa',
								image: null,
								role: 'Project Lead & Business Analyst',
								desc: 'Memimpin strategisasi produk, pemetaan ekosistem bisnis, dan perumusan model monetisasi ekonomi kreatif yang berkelanjutan.',
							},
							{
								name: 'Muhammad Attan',
								image: '/images/attan.png',
								role: 'Lead AI & Backend Architect',
								desc: 'Arsitek utama sistem RAG dan integrasi LLM. Bertanggung jawab atas pengelolaan infrastruktur server dan orkestrasi knowledge base.',
							},
							{
								name: 'Okyra Asyrafi Guchan',
								image: null,
								role: 'Head of UI/UX & Frontend',
								desc: 'Sutradara pengalaman pengguna (UX) dan rekayasa antarmuka. Memastikan setiap interaksi terasa berkelas, mulus, dan responsif.',
							},
							{
								name: 'Pandu Pratama Handika',
								image: '/images/pandu.png',
								role: 'Frontend Dev & Domain Expert',
								desc: 'Mengeksekusi rekayasa klien (client-side) sekaligus berperan esensial sebagai validator mutu budaya dan bahasa pada setiap luaran sistem.',
							},
						].map((member, i) => (
							<Card
								key={i}
								withBorder
								radius="xl"
								padding={0}
								shadow="md"
								style={{
									backgroundColor: '#ffffff',
									display: 'flex',
									flexDirection: 'column',
									overflow: 'hidden',
								}}
								className="transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
							>
								{/* Profile Photo (Aspect Ratio 4:5 for Portraits) */}
								<Box
									style={{
										width: '100%',
										aspectRatio: '4/5',
										backgroundColor: '#e2e8f0',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										position: 'relative',
										overflow: 'hidden',
									}}
								>
									{member.image ? (
										<img
											src={member.image}
											alt={member.name}
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
												objectPosition: 'center',
												position: 'absolute',
												top: 0,
												left: 0,
											}}
										/>
									) : (
										<Text
											size="2rem"
											fw={900}
											c="slate.4"
											style={{ letterSpacing: rem(1) }}
										>
											{member.name
												.split(' ')
												.map((n) => n[0])
												.join('')
												.substring(0, 2)}
										</Text>
									)}
								</Box>

								{/* Content Box */}
								<Box
									p="xl"
									style={{
										flexGrow: 1,
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									<Title
										order={3}
										size="h4"
										fw={900}
										c="slate.9"
										mb={4}
										style={{ letterSpacing: '-0.02em' }}
									>
										{member.name}
									</Title>
									<Text
										size="xs"
										fw={800}
										c="blue.6"
										tt="uppercase"
										mb="lg"
										style={{ letterSpacing: rem(1) }}
									>
										{member.role}
									</Text>

									<Divider
										mb="lg"
										color="slate.1"
									/>

									<Text
										size="sm"
										c="slate.6"
										fw={400}
										style={{ lineHeight: 1.6 }}
									>
										{member.desc}
									</Text>
								</Box>
							</Card>
						))}
					</SimpleGrid>
				</Container>
			</section>

			{/* FOOTER */}
			<div className="border-t border-slate-900 bg-slate-950">
				<Footer />
			</div>
		</div>
	);
}
