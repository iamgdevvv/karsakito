import { Badge, Box, Container, Flex, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { LuArrowRight } from 'react-icons/lu';
import { metaPublicRoute } from '~app-modules/meta';
import { cfContext } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import { Image } from '~app-ui/components/image';
import { ButtonLink } from '~app-ui/components/link';
import Banner from '~app-ui/layouts/banner';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';

import type { Route } from './+types/_index';

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

export default function HomeRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<Header authUser={loaderData.user} />
			<main className="site-main">
				<Banner
					background="/images/karsakito-beranda-banner.jpg"
					ctas={[
						{
							label: 'Pelajari Selengkapnya',
							to: '/tentang',
							variant: 'light',
						},
						{
							label: 'Lihat Layanan',
							to: '/layanan',
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

				{/* 1. PANEL 1: PROBLEM VALIDATION (Responsive Sticky - z-10) */}
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

				{/* 2. PANEL 2: SOLUTION APPROACH - PART 1 (Responsive Sticky - z-20) */}
				<Box
					component="section"
					bg="white"
					py={{
						base: 48,
						sm: 60,
						lg: 80,
					}}
					className="z-20 flex h-auto w-full border-t border-slate-200 shadow-[0_-30px_60px_rgba(0,0,0,0.04)] md:sticky md:top-16"
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
							<div className="group hover:bg-primary-50 grid grid-cols-1 gap-4 bg-white px-2 py-6 transition-colors duration-300 md:grid-cols-12 md:gap-6 md:px-4 md:py-8">
								<Text
									span
									size="sm"
									fw={700}
									className="group-hover:text-primary text-gray-600 transition-colors md:col-span-1"
								>
									01
								</Text>
								<Title
									order={3}
									fz="md"
									className="md:col-span-3"
								>
									KarsaLingo
								</Title>
								<Text
									size="sm"
									c="gray.6"
									className="md:col-span-8"
								>
									Media belajar modern, interaktif, dan adaptif untuk penguasaan
									bahasa daerah yang dirancang khusus untuk membantu transisi
									pemahaman bahasa lintas generasi.
								</Text>
							</div>
							<div className="group hover:bg-primary-50 grid grid-cols-1 gap-4 bg-white px-2 py-6 transition-colors duration-300 md:grid-cols-12 md:gap-6 md:px-4 md:py-8">
								<Text
									span
									size="sm"
									fw={700}
									className="group-hover:text-primary text-gray-600 transition-colors md:col-span-1"
								>
									02
								</Text>
								<Title
									order={3}
									fz="md"
									className="md:col-span-3"
								>
									KarsaWriter
								</Title>
								<Text
									size="sm"
									c="gray.6"
									className="md:col-span-8"
								>
									Asisten produktivitas berbasis kecerdasan buatan untuk menyusun
									draf konten, naskah kreatif, karya sastra tradisional, serta
									artikel formal berbahasa lokal secara efisien.
								</Text>
							</div>
							<div className="group hover:bg-primary-50 grid grid-cols-1 gap-2 bg-white px-2 py-4 transition-colors duration-300 md:grid-cols-12 md:gap-6 md:px-4 md:py-6">
								<Text
									span
									size="sm"
									fw={700}
									className="group-hover:text-primary text-gray-600 transition-colors md:col-span-1"
								>
									03
								</Text>
								<Title
									order={3}
									fz="md"
									className="md:col-span-3"
								>
									KarsaLator
								</Title>
								<Text
									size="sm"
									c="gray.6"
									className="md:col-span-8"
								>
									Sistem translasi kontekstual tingkat lanjut yang akurat,
									menjamin ketepatan makna berdasarkan basis pengetahuan adat yang
									dapat dipertanggungjawabkan.
								</Text>
							</div>
							<div className="group hover:bg-primary-50 grid grid-cols-1 gap-2 bg-white px-2 py-4 transition-colors duration-300 md:grid-cols-12 md:gap-6 md:px-4 md:py-6">
								<Text
									span
									size="sm"
									fw={700}
									className="group-hover:text-primary text-gray-600 transition-colors md:col-span-1"
								>
									04
								</Text>
								<Title
									order={3}
									fz="md"
									className="md:col-span-3"
								>
									KarsaLisa
								</Title>
								<Text
									size="sm"
									c="gray.6"
									className="md:col-span-8"
								>
									Modul analisis bahasa cerdas untuk mengevaluasi kesopanan
									berbahasa, ketepatan tata bahasa daerah, serta kecocokan konteks
									sosial penggunaan kata.
								</Text>
							</div>
							<div className="group hover:bg-primary-50 grid grid-cols-1 gap-2 bg-white px-2 py-4 transition-colors duration-300 md:grid-cols-12 md:gap-6 md:px-4 md:py-6">
								<Text
									span
									size="sm"
									fw={700}
									className="group-hover:text-primary text-gray-600 transition-colors md:col-span-1"
								>
									05
								</Text>
								<Title
									order={3}
									fz="md"
									className="md:col-span-3"
								>
									KarsaPedia
								</Title>
								<Text
									size="sm"
									c="gray.6"
									className="md:col-span-8"
								>
									Ensiklopedia warisan budaya dan adat nusantara berbasis
									Retrieval-Augmented Generation (RAG) yang menyediakan akses
									informasi tepercaya secara praktis.
								</Text>
							</div>
							<div className="group hover:bg-primary-50 grid grid-cols-1 gap-2 bg-white px-2 py-4 transition-colors duration-300 md:grid-cols-12 md:gap-6 md:px-4 md:py-6">
								<Text
									span
									size="sm"
									fw={700}
									className="group-hover:text-primary text-gray-600 transition-colors md:col-span-1"
								>
									06
								</Text>
								<Title
									order={3}
									fz="md"
									className="md:col-span-3"
								>
									KarsaFrase
								</Title>
								<Text
									size="sm"
									c="gray.6"
									className="md:col-span-8"
								>
									Alat restrukturisasi dan parafrase teks otomatis guna mengolah
									ragam bentuk kalimat bahasa lokal tanpa merubah esensi makna
									budaya asli.
								</Text>
							</div>
						</SimpleGrid>
					</Container>
				</Box>

				{/* 4. PANEL 4: TECHNICAL INNOVATION & DEMAND (Responsive Sticky - z-40) */}
				{/* <Box
					component="section"
					bg="gray.0"
					py={{
						base: 48,
						sm: 60,
						lg: 80,
					}}
					className="z-40 flex h-auto w-full border-t border-slate-200 shadow-[0_-30px_50px_rgba(0,0,0,0.05)] md:sticky md:top-16"
				>
					<Container className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
						<div>
							<h3 className="mb-4 text-xl font-bold text-slate-900 md:text-2xl">
								Strategi Optimasi Biaya Operasional &amp; Human-in-the-Loop
							</h3>
							<p className="text-sm leading-relaxed font-light text-slate-600 md:text-base">
								KarsaKito memisahkan konten dinamis dan statis. Konten pembelajaran
								dan topik budaya terverifikasi yang sukses dibuat AI disimpan ke
								database terpusat, sehingga dapat diakses berulang tanpa memicu
								inferensi LLM terus-menerus. Kualitas diperkaya lewat kurasi pakar
								dan komunitas.
							</p>
						</div>
						<div>
							<h3 className="mb-4 text-xl font-bold text-slate-900 md:text-2xl">
								Tervalidasi oleh Kebutuhan Pasar Nyata (31 Responden)
							</h3>
							<p className="text-sm leading-relaxed font-light text-slate-600 md:text-base">
								Berdasarkan survei terhadap 31 responden dari berbagai latar
								belakang (pelajar, mahasiswa, guru, dosen, hingga kreator konten),
								mayoritas mutlak mengalami kesulitan menulis karya sastra dan
								mencari referensi adat yang valid. Responden menilai teknologi AI
								esensial dalam pelestarian budaya lokal.
							</p>
						</div>
					</Container>
				</Box> */}

				{/* 5. PANEL 5: PREMIUM LIGHT CTA & EDGE-TO-EDGE FOOTER (z-50 - Penutup Mutlak) */}
				<Box
					component="section"
					bg="white"
					py={{
						base: 48,
						sm: 60,
						lg: 80,
					}}
					className="z-50 flex w-full flex-col border-t border-slate-200 shadow-[0_-30px_60px_rgba(0,0,0,0.06)] md:sticky"
				>
					<Container
						size="sm"
						ta="center"
					>
						<Title
							order={2}
							mb="md"
						>
							Mengakselerasi Warisan Budaya dalam Ekonomi Kreatif Digital Indonesia
						</Title>
						<Text
							c="gray.6"
							fz={{
								base: 'sm',
								lg: 'md',
							}}
							mb="lg"
						>
							Dari penyediaan media belajar modern untuk ekosistem pendidikan hingga
							penyediaan REST API profesional untuk kreator konten, industri kreatif,
							dan developer aplikasi pihak ketiga. KarsaKito mentransformasi budaya
							dari objek dokumentasi pasif menjadi aset produktif bernilai ekonomi
							tinggi nasional.
						</Text>
						<Group justify="center">
							<ButtonLink
								to="/tentang"
								variant="light"
							>
								Pelajari Selengkapnya
							</ButtonLink>
							<ButtonLink to="/apps">Mulai Sekarang</ButtonLink>
						</Group>
					</Container>
				</Box>
			</main>
			<Footer />
		</div>
	);
}
