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
	Title,
} from '@mantine/core';
import { LuArrowRight } from 'react-icons/lu';
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
			'Platform AI untuk Mengakselerasi Pemanfaatan Bahasa dan Warisan Budaya Daerah',
		noIndex: loaderData.noIndex,
	});
}

const solutions = [
	{
		title: 'KarsaLingo',
		desc: 'Media belajar modern, interaktif, dan adaptif untuk penguasaan bahasa daerah yang dirancang khusus untuk membantu transisi pemahaman bahasa lintas generasi.',
	},
	{
		title: 'KarsaWriter',
		desc: 'Asisten produktivitas berbasis kecerdasan buatan untuk menyusun draf konten, naskah kreatif, karya sastra tradisional, serta artikel formal berbahasa lokal secara efisien.',
	},
	{
		title: 'KarsaLator',
		desc: 'Sistem translasi kontekstual tingkat lanjut yang akurat, menjamin ketepatan makna berdasarkan basis pengetahuan adat yang dapat dipertanggungjawabkan.',
	},
	{
		title: 'KarsaLisa',
		desc: 'Modul analisis bahasa cerdas untuk mengevaluasi kesopanan berbahasa, ketepatan tata bahasa daerah, serta kecocokan konteks sosial penggunaan kata.',
	},
	{
		title: 'KarsaPedia',
		desc: 'Ensiklopedia warisan budaya dan adat nusantara berbasis Retrieval-Augmented Generation (RAG) yang menyediakan akses informasi tepercaya secara praktis.',
	},
	{
		title: 'KarsaFrase',
		desc: 'Alat restrukturisasi dan parafrase teks otomatis guna mengolah ragam bentuk kalimat bahasa lokal tanpa merubah esensi makna budaya asli.',
	},
];

const teams = [
	{
		name: 'Grafis Nuresa',
		position: 'Project Lead, Business Analyst, dan UI/UX Strategist',
		desc: 'Memimpin pengembangan produk, menyusun strategi bisnis, merancang pengalaman pengguna, serta memastikan solusi yang dibangun selaras dengan kebutuhan pengguna.',
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
		desc: 'Membangun fitur end-to-end, mengintegrasikan frontend dan backend, serta memastikan implementasi berjalan optimal di seluruh alur aplikasi.',
		image: '/images/okyra-asyrafi-guchan.jpg',
	},
	{
		name: 'Pandu Pratama Handika',
		position: 'Frontend Developer',
		desc: 'Mengimplementasikan antarmuka yang responsif, interaktif, dan mudah digunakan dengan fokus pada performa, aksesibilitas, serta pengalaman pengguna yang konsisten.',
		image: '/images/pandu-pratama-handika.jpg',
	},
];

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

export default function TentangRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<Header authUser={loaderData.user} />
			<main className="site-main">
				<Banner
					background="/images/karsakito-beranda-banner.jpg"
					ctas={[
						{
							label: 'Layanan KarsaKito',
							to: '/layanan',
							variant: 'light',
						},
						{
							label: 'Biaya Layanan',
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
						Platform AI untuk Mengakselerasi Pemanfaatan Bahasa dan Warisan Budaya
						Daerah
					</Title>
					<Text>
						KarsaKito menghadirkan ekosistem AI yang mengintegrasikan pembelajaran
						bahasa daerah, pembuatan karya, penerjemahan, parafrase, analisis penggunaan
						bahasa, serta ensiklopedia budaya dalam satu platform.
					</Text>
				</Banner>

				{/* 1. SEKSI SOCIAL PROOF (Didukung Oleh - Statis & Proporsional) */}
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
							gap="xl"
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

				{/* 2. PANEL 1: PROBLEM VALIDATION (Responsive Sticky - z-10) */}
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
								Problem Validation
							</Badge>
							<h2 className="text-2xl leading-tight font-black tracking-tight text-slate-900 sm:text-3xl md:text-5xl">
								Akar Masalah: Minimnya Dukungan Teknologi Produktivitas Bahasa
								Daerah.
							</h2>
						</div>
						<Stack className="md:col-span-6">
							<Text fw={300}>
								Masyarakat menghadapi hambatan nyata ketika ingin mempelajari,
								menggunakan, atau menghasilkan karya berbasis bahasa daerah karena
								kesulitan memahami kosakata, keterbatasan media belajar modern,
								serta sulitnya mengakses informasi adat secara praktis.
							</Text>
							<Text fw={300}>
								Saat ini teknologi AI global telah membantu penulisan dalam bahasa
								global, namun dukungan serupa untuk bahasa daerah masih sangat
								terbatas pada aspek tata bahasa, kesopanan (KarsaLisa), dan
								pengetahuan adat. Jika dibiarkan, transfer pengetahuan budaya
								antargenerasi berisiko terputus.
							</Text>
						</Stack>
					</Container>
				</Box>

				{/* 3. PANEL 2: SOLUTION APPROACH - PART 1 (Responsive Sticky - z-20) */}
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
								SOLUTION APPROACH
							</Badge>
							<Title
								order={2}
								mb="md"
							>
								Ekosistem AI Terintegrasi Berbasis RAG
							</Title>
							<Text
								c="gray.6"
								fz={{
									base: 'sm',
									lg: 'md',
								}}
							>
								KarsaKito mengintegrasikan knowledge base budaya terstruktur dengan
								teknologi Retrieval-Augmented Generation (RAG) untuk menghasilkan
								respons yang kontekstual dan relevan, diawali melalui implementasi
								Bahasa Minangkabau.
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
										{Number(index + 1).toLocaleString('en-US', {
											minimumIntegerDigits: 2,
											useGrouping: false,
										})}
									</Text>
									<Title
										order={3}
										fz="lg"
										className="md:col-span-3"
									>
										{solution.title}
									</Title>
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
