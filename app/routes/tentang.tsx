import { Carousel } from '@mantine/carousel';
import {
	Accordion,
	AspectRatio,
	Badge,
	Box,
	Container,
	Flex,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { LuArrowRight, LuTrophy } from 'react-icons/lu';
import { getPublicFaqs } from '~app-modules/faqs';
import { metaPublicRoute } from '~app-modules/meta';
import { cfContext } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import { Image } from '~app-ui/components/image';
import { TestimonialCard } from '~app-ui/components/testimonial';
import Banner from '~app-ui/layouts/banner';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';

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
		title: 'KarsaKito',
		description:
			'Ekosistem produktivitas AI untuk membantu pekerjaan berbasis Bahasa Nusantara melalui alur kerja terstruktur.',
		noIndex: loaderData.noIndex,
	});
}

const solutions = [
	{
		title: 'KarsaWriter',
		desc: 'Susun draf teks dengan topik, tujuan, audiens, dan gaya yang lebih jelas.',
	},
	{
		title: 'KarsaLator',
		desc: 'Terjemahkan teks, lalu tinjau dan sesuaikan hasilnya dengan konteks penggunaan.',
	},
	{
		title: 'KarsaLisa',
		desc: 'Tinjau pilihan bahasa dan konteks penggunaan agar komunikasi Anda lebih sesuai kebutuhan.',
	},
	{
		title: 'KarsaFrase',
		desc: 'Susun ulang teks tanpa mengubah inti pesan agar lebih ringkas, jelas, atau sesuai gaya yang Anda pilih.',
	},
	{
		title: 'KarsaPedia',
		desc: 'Dalam pengembangan sebagai ruang pengetahuan untuk membantu pencarian informasi seputar Bahasa Nusantara.',
		status: 'Dalam pengembangan',
	},
	{
		title: 'KarsaLingo',
		desc: 'Dalam pengembangan untuk mendukung proses belajar Bahasa Nusantara melalui pengalaman yang lebih terarah.',
		status: 'Dalam pengembangan',
	},
];

const teams = [
	{
		name: 'Grafis Nuresa',
		position: 'Project Lead, Business Analyst, dan UI/UX Strategist',
		desc: 'Memimpin pengembangan produk, menyusun strategi bisnis, merancang pengalaman Pengguna, serta memastikan solusi yang dibangun selaras dengan kebutuhan Pengguna.',
		image: '/images/grafis-nuresa.jpg',
	},
	{
		name: 'Muhammad Attan',
		position: 'AI/Backend Developer',
		desc: 'Mengembangkan arsitektur backend, mengintegrasikan layanan AI, merancang API, serta memastikan performa, keamanan, dan skalabilitas sistem.',
		image: '/images/muhammad-attan.jpg',
	},
	{
		name: 'Okyra Asyrafi Guchan',
		position: 'Full Stack Developer',
		desc: 'Membangun fitur end-to-end, mengintegrasikan frontend dan backend, serta memastikan implementasi berjalan optimal di seluruh alur Aplikasi.',
		image: '/images/okyra-asyrafi-guchan.jpg',
	},
	{
		name: 'Pandu Pratama Handika',
		position: 'Frontend Developer',
		desc: 'Mengimplementasikan antarmuka yang responsif, interaktif, dan mudah digunakan dengan fokus pada performa, aksesibilitas, serta pengalaman Pengguna yang konsisten.',
		image: '/images/pandu-pratama-handika.jpg',
	},
];

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

const faqs = getPublicFaqs(['tentang', 'layanan', 'kreator', 'hasil'], {
	featuredOnly: true,
});

export default function TentangRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<Header authUser={loaderData.user} />
			<main className="site-main">
				<Banner
					background="/images/karsakito-beranda-banner.jpg"
					ctas={[
						{
							label: 'Jelajahi Layanan',
							to: '/layanan',
							variant: 'light',
						},
						{
							label: 'Harga Token',
							to: '/biaya-layanan',
							rightSection: <LuArrowRight size={20} />,
						},
					]}
				>
					<Text
						span
						size="xs"
						fw={700}
						c="primary"
						tt="uppercase"
					>
						KarsaKito
					</Text>
					<Title>
						Platform AI untuk Mengakselerasi Pemanfaatan Bahasa Daerah Indonesia
					</Title>
					<Text>
						KarsaKito menghadirkan ekosistem AI yang mengintegrasikan pembelajaran
						bahasa daerah, pembuatan karya, penerjemahan, parafrase, analisis penggunaan
						bahasa, serta ensiklopedia budaya dalam satu platform.
					</Text>
				</Banner>

				<Box
					component="section"
					bg="white"
					py={{
						base: 48,
						sm: 60,
						lg: 80,
					}}
					className="z-10 w-full md:sticky md:top-16"
				>
					<Container>
						<Stack
							align="center"
							gap="sm"
						>
							<ThemeIcon
								size={56}
								radius="full"
								variant="light"
							>
								<LuTrophy size={26} />
							</ThemeIcon>
							<Text
								span
								display="inline-block"
								size="xs"
								tt="uppercase"
								ta="center"
								c="gray.6"
							>
								Peserta PIDI - DIGDAYA X Hackathon 2026
							</Text>
							<Text
								maw={620}
								ta="center"
								c="gray.6"
							>
								KarsaKito mengikuti PIDI - DIGDAYA X Hackathon 2026 sebagai bagian
								dari perjalanan mengembangkan solusi produktivitas AI untuk Bahasa
								Nusantara.
							</Text>
						</Stack>
						<Stack
							align="center"
							gap="xl"
							mt="xl"
						>
							<Text
								span
								display="inline-block"
								size="xs"
								tt="uppercase"
								ta="center"
								c="gray.6"
							>
								Didukung &amp; dipercaya oleh
							</Text>
							<Flex
								align="center"
								wrap="wrap"
								justify="center"
								gap={{
									base: 'lg',
									md: 'xl',
									lg: 48,
								}}
							>
								<Image
									src="/images/logo/logo-bankindonesia.svg"
									alt="Bank Indonesia"
									objectFit="contain"
									w="auto"
									h="auto"
									maw={200}
									mah={60}
									className="opacity-80 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
								/>
								<Image
									src="/images/logo/logo-ojk.svg"
									alt="OJK"
									w="auto"
									h="auto"
									maw={200}
									mah={60}
									className="opacity-80 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
								/>
								<Image
									src="/images/logo/logo-lppi.svg"
									alt="LPPI"
									w="auto"
									h="auto"
									maw={200}
									mah={60}
									className="opacity-80 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
								/>
							</Flex>
						</Stack>
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
					className="z-10 flex h-auto w-full border-t border-slate-200 shadow-[0_-20px_40px_rgba(0,0,0,0.02)] md:sticky md:top-16"
				>
					<Container className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
						<div className="md:col-span-6">
							<Badge
								variant="light"
								color="red"
								size="lg"
								fz={10}
								fw={500}
								mb="sm"
							>
								Masalah & Tantangan
							</Badge>
							<h2 className="text-2xl leading-tight font-black tracking-tight text-slate-900 sm:text-3xl md:text-5xl">
								Pekerjaan berbasis bahasa membutuhkan proses yang lebih terarah.
							</h2>
						</div>
						<Stack className="md:col-span-6">
							<Text fw={300}>
								Menyusun teks, menyesuaikan gaya, menerjemahkan, atau memilih frasa
								dapat memakan waktu, terutama saat tujuan, audiens, dan konteksnya
								beragam.
							</Text>
							<Text fw={300}>
								KarsaKito membantu Anda memulai pekerjaan melalui tool dengan
								parameter terstruktur. Hasilnya dapat Anda tinjau dan sesuaikan
								sebelum digunakan.
							</Text>
						</Stack>
					</Container>
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
					<Container className="flex w-full flex-col">
						<Box
							w="100%"
							maw={680}
						>
							<Badge
								variant="light"
								size="lg"
								fz={10}
								fw={500}
								mb="sm"
							>
								Solusi KarsaKito
							</Badge>
							<Title
								order={2}
								mb="md"
							>
								Alur kerja terstruktur untuk kebutuhan bahasa
							</Title>
							<Text
								c="gray.6"
								fz={{
									base: 'sm',
									lg: 'md',
								}}
							>
								KarsaKito terus disempurnakan bersama Pengguna. Kami memprioritaskan
								tool yang membantu pekerjaan berbasis bahasa menjadi lebih terarah,
								mudah digunakan, dan relevan dengan kebutuhan nyata.
							</Text>
						</Box>

						<SimpleGrid
							spacing={0}
							cols={{
								base: 1,
								md: 2,
							}}
							mt="xl"
							className="border-y border-slate-200"
						>
							{solutions.map((solution, index) => (
								<div
									key={`solution-${index}`}
									className="group hover:bg-primary-50 grid grid-cols-1 gap-4 bg-white px-2 py-6 transition-colors duration-300 md:grid-cols-12 md:gap-6 md:px-4 md:py-8"
								>
									<Text
										span
										size="sm"
										fw={700}
										className="group-hover:text-primary text-gray-600 transition-colors md:col-span-1"
									>
										{String(index + 1).padStart(2, '0')}
									</Text>
									<Stack
										gap={2}
										className="md:col-span-3"
									>
										<Title
											order={3}
											fz="lg"
										>
											{solution.title}
										</Title>
										{solution.status ? (
											<Text
												size="xs"
												fw={600}
												c="primary"
											>
												{solution.status}
											</Text>
										) : null}
									</Stack>
									<Text
										c="gray.6"
										fw={300}
										className="md:col-span-8"
									>
										{solution.desc}
									</Text>
								</div>
							))}
						</SimpleGrid>
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
								Tim Kito
							</Badge>
							<Title order={2}>Orang-orang di Balik KarsaKito</Title>
						</Stack>
						<SimpleGrid
							mt="xl"
							cols={{
								base: 1,
								sm: 2,
								md: 4,
							}}
						>
							{teams.map((team, index) => (
								<AspectRatio
									key={`team-${index}`}
									ratio={2 / 3}
									pos="relative"
									px="lg"
									py="xl"
									bdrs="xl"
									className="group overflow-hidden"
								>
									<Image
										src={team.image}
										pos="absolute"
										top={0}
										left={0}
										w="100%"
										h="100%"
										className="z-1"
									/>
									<Box
										pos="absolute"
										top={0}
										left={0}
										w="100%"
										h="100%"
										className="group-hover:to-dark/80 z-2 bg-linear-to-t from-black to-transparent transition-colors"
									/>
									<Stack
										pos="relative"
										mt="auto"
										gap="xs"
										justify="flex-end"
										c="white"
										className="z-3"
									>
										<Text
											mb="lg"
											className="transition group-hover:opacity-100 lg:opacity-0"
										>
											{team.desc}
										</Text>
										<Text
											span
											size="sm"
											fw={300}
										>
											{team.position}
										</Text>
										<Title
											order={3}
											fz="md"
										>
											{team.name}
										</Title>
									</Stack>
								</AspectRatio>
							))}
						</SimpleGrid>
					</Container>
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
			</main>
			<Footer />
		</div>
	);
}
