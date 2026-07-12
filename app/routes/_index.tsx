import { Text, Title } from '@mantine/core';
import { LuArrowRight } from 'react-icons/lu';
import { metaPublicRoute } from '~app-modules/meta';
import { authGetSession } from '~app-server/session';
import Banner from '~app-ui/layouts/banner';
import { Header } from '~app-ui/layouts/header';
import { cloudflareContext } from '~workers/app';

import type { Route } from './+types/_index';

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
				<section className="relative z-10 w-full border-y border-slate-200 bg-white px-6 py-14">
					<p className="mb-10 text-center text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">
						DIDUKUNG &amp; DIPERCAYA OLEH
					</p>
					<div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-16 md:gap-24">
						<img
							src="/images/bank indonesia.png"
							alt="Bank Indonesia"
							className="h-16 w-auto object-contain opacity-80 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 md:h-24"
						/>
						<img
							src="/images/ojk.jpg"
							alt="OJK"
							className="h-10 w-auto object-contain opacity-80 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 md:h-14"
						/>
						<img
							src="/images/lppi logo.jpg"
							alt="LPPI"
							className="h-14 w-auto object-contain opacity-80 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 md:h-20"
						/>
					</div>
				</section>

				{/* 1. PANEL 1: PROBLEM VALIDATION (Responsive Sticky - z-10) */}
				<section className="relative top-16 z-10 flex h-auto w-full items-center border-t border-slate-200 bg-slate-50 px-4 py-16 shadow-[0_-20px_40px_rgba(0,0,0,0.02)] sm:px-6 md:sticky md:h-screen md:py-20 lg:px-8">
					<div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
						<div className="md:col-span-6">
							<span className="mb-4 block text-xs font-bold tracking-wider text-red-500">
								■ PROBLEM VALIDATION
							</span>
							<h2 className="text-2xl leading-tight font-black tracking-tight text-slate-900 sm:text-3xl md:text-5xl">
								Akar Masalah: Minimnya Dukungan Teknologi Produktivitas Bahasa
								Daerah.
							</h2>
						</div>
						<div className="text-sm leading-relaxed font-light text-slate-600 sm:text-base md:col-span-6">
							<p className="mb-6">
								Masyarakat menghadapi hambatan nyata ketika ingin mempelajari,
								menggunakan, atau menghasilkan karya berbasis bahasa daerah karena
								kesulitan memahami kosakata, keterbatasan media belajar modern,
								serta sulitnya mengakses informasi adat secara praktis.
							</p>
							<p>
								Saat ini teknologi AI global telah membantu penulisan dalam bahasa
								global, namun dukungan serupa untuk bahasa daerah masih sangat
								terbatas pada aspek tata bahasa, kesopanan (KarsaLisa), dan
								pengetahuan adat. Jika dibiarkan, transfer pengetahuan budaya
								antargenerasi berisiko terputus.
							</p>
						</div>
					</div>
				</section>

				{/* 2. PANEL 2: SOLUTION APPROACH - PART 1 (Responsive Sticky - z-20) */}
				<section className="relative top-16 z-20 flex h-auto w-full items-center border-t border-slate-200 bg-white px-4 py-16 shadow-[0_-30px_60px_rgba(0,0,0,0.04)] sm:px-6 md:sticky md:h-screen md:py-20 lg:px-8">
					<div className="mx-auto flex w-full max-w-7xl flex-col justify-center">
						<span className="mb-4 block text-xs font-bold tracking-wider text-blue-600">
							■ SOLUTION APPROACH
						</span>
						<h2 className="mb-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
							Ekosistem AI Terintegrasi Berbasis RAG
						</h2>
						<p className="mb-8 max-w-4xl text-sm leading-relaxed font-light text-slate-500 sm:text-base md:mb-12 md:text-lg">
							KarsaKito mengintegrasikan knowledge base budaya terstruktur dengan
							teknologi Retrieval-Augmented Generation (RAG) untuk menghasilkan
							respons yang kontekstual dan relevan, diawali melalui implementasi
							Bahasa Minangkabau.
						</p>

						<div className="flex flex-col border-t border-slate-200">
							<div className="group grid grid-cols-1 gap-4 border-b border-slate-200 bg-white px-2 py-6 transition-colors duration-300 hover:bg-slate-50/50 md:grid-cols-12 md:gap-6 md:px-4 md:py-8">
								<div className="font-mono text-sm font-bold text-slate-400 transition-colors group-hover:text-blue-600 md:col-span-1">
									01
								</div>
								<div className="text-lg font-bold text-slate-900 md:col-span-3 md:text-xl">
									KarsaLingo
								</div>
								<div className="text-sm leading-relaxed text-slate-600 md:col-span-8 md:text-base">
									Media belajar modern, interaktif, dan adaptif untuk penguasaan
									bahasa daerah yang dirancang khusus untuk membantu transisi
									pemahaman bahasa lintas generasi.
								</div>
							</div>
							<div className="group grid grid-cols-1 gap-4 border-b border-slate-200 bg-white px-2 py-6 transition-colors duration-300 hover:bg-slate-50/50 md:grid-cols-12 md:gap-6 md:px-4 md:py-8">
								<div className="font-mono text-sm font-bold text-slate-400 transition-colors group-hover:text-blue-600 md:col-span-1">
									02
								</div>
								<div className="text-lg font-bold text-slate-900 md:col-span-3 md:text-xl">
									KarsaWriter
								</div>
								<div className="text-sm leading-relaxed text-slate-600 md:col-span-8 md:text-base">
									Asisten produktivitas berbasis kecerdasan buatan untuk menyusun
									draf konten, naskah kreatif, karya sastra tradisional, serta
									artikel formal berbahasa lokal secara efisien.
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* 3. PANEL 3: SOLUTION APPROACH - PART 2 (Responsive Sticky - z-30) */}
				<section className="relative top-16 z-30 flex h-auto w-full items-center border-t border-slate-200 bg-white px-4 py-16 shadow-[0_-30px_60px_rgba(0,0,0,0.04)] sm:px-6 md:sticky md:h-screen md:py-20 lg:px-8">
					<div className="mx-auto flex w-full max-w-7xl flex-col justify-center">
						<div className="flex flex-col border-t border-slate-200">
							<div className="group grid grid-cols-1 gap-2 border-b border-slate-200 bg-white px-2 py-4 transition-colors duration-300 hover:bg-slate-50/50 md:grid-cols-12 md:gap-6 md:px-4 md:py-6">
								<div className="font-mono text-sm font-bold text-slate-400 transition-colors group-hover:text-blue-600 md:col-span-1">
									03
								</div>
								<div className="text-lg font-bold text-slate-900 md:col-span-3 md:text-xl">
									KarsaLator
								</div>
								<div className="text-sm leading-relaxed text-slate-600 md:col-span-8 md:text-base">
									Sistem translasi kontekstual tingkat lanjut yang akurat,
									menjamin ketepatan makna berdasarkan basis pengetahuan adat yang
									dapat dipertanggungjawabkan.
								</div>
							</div>
							<div className="group grid grid-cols-1 gap-2 border-b border-slate-200 bg-white px-2 py-4 transition-colors duration-300 hover:bg-slate-50/50 md:grid-cols-12 md:gap-6 md:px-4 md:py-6">
								<div className="font-mono text-sm font-bold text-slate-400 transition-colors group-hover:text-blue-600 md:col-span-1">
									04
								</div>
								<div className="text-lg font-bold text-slate-900 md:col-span-3 md:text-xl">
									KarsaLisa
								</div>
								<div className="text-sm leading-relaxed text-slate-600 md:col-span-8 md:text-base">
									Modul analisis bahasa cerdas untuk mengevaluasi kesopanan
									berbahasa, ketepatan tata bahasa daerah, serta kecocokan konteks
									sosial penggunaan kata.
								</div>
							</div>
							<div className="group grid grid-cols-1 gap-2 border-b border-slate-200 bg-white px-2 py-4 transition-colors duration-300 hover:bg-slate-50/50 md:grid-cols-12 md:gap-6 md:px-4 md:py-6">
								<div className="font-mono text-sm font-bold text-slate-400 transition-colors group-hover:text-blue-600 md:col-span-1">
									05
								</div>
								<div className="text-lg font-bold text-slate-900 md:col-span-3 md:text-xl">
									KarsaPedia
								</div>
								<div className="text-sm leading-relaxed text-slate-600 md:col-span-8 md:text-base">
									Ensiklopedia warisan budaya dan adat nusantara berbasis
									Retrieval-Augmented Generation (RAG) yang menyediakan akses
									informasi tepercaya secara praktis.
								</div>
							</div>
							<div className="group grid grid-cols-1 gap-2 border-b border-slate-200 bg-white px-2 py-4 transition-colors duration-300 hover:bg-slate-50/50 md:grid-cols-12 md:gap-6 md:px-4 md:py-6">
								<div className="font-mono text-sm font-bold text-slate-400 transition-colors group-hover:text-blue-600 md:col-span-1">
									06
								</div>
								<div className="text-lg font-bold text-slate-900 md:col-span-3 md:text-xl">
									KarsaFrase
								</div>
								<div className="text-sm leading-relaxed text-slate-600 md:col-span-8 md:text-base">
									Alat restrukturisasi dan parafrase teks otomatis guna mengolah
									ragam bentuk kalimat bahasa lokal tanpa merubah esensi makna
									budaya asli.
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* 4. PANEL 4: TECHNICAL INNOVATION & DEMAND (Responsive Sticky - z-40) */}
				<section className="relative top-16 z-40 flex h-auto w-full items-center border-t border-slate-200 bg-slate-50 px-4 py-16 shadow-[0_-30px_50px_rgba(0,0,0,0.05)] sm:px-6 md:sticky md:h-screen md:py-20 lg:px-8">
					<div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
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
					</div>
				</section>

				{/* 5. PANEL 5: PREMIUM LIGHT CTA & EDGE-TO-EDGE FOOTER (z-50 - Penutup Mutlak) */}
				<section className="relative z-50 flex w-full flex-col justify-between border-t border-slate-200 bg-white px-0 pt-24 shadow-[0_-30px_60px_rgba(0,0,0,0.06)]">
					<div className="mx-auto mb-20 max-w-4xl px-4 text-center md:mb-32">
						<h2 className="mb-6 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-6xl">
							Mengakselerasi Warisan Budaya dalam Ekonomi Kreatif Digital Indonesia
						</h2>
						<p className="mx-auto mb-8 max-w-2xl text-xs leading-relaxed font-light text-slate-500 sm:text-sm md:text-base">
							Dari penyediaan media belajar modern untuk ekosistem pendidikan hingga
							penyediaan REST API profesional untuk kreator konten, industri kreatif,
							dan developer aplikasi pihak ketiga. KarsaKito mentransformasi budaya
							dari objek dokumentasi pasif menjadi aset produktif bernilai ekonomi
							tinggi nasional.
						</p>
						<a
							href="/register"
							className="inline-block w-full rounded-xl bg-blue-600 px-8 py-4 text-center text-base font-bold tracking-wide text-white shadow-xl shadow-blue-600/10 transition-all hover:bg-blue-700 sm:w-auto"
						>
							Mulai Akselerasi Sekarang (Freemium)
						</a>
					</div>

					{/* Footer Edge-to-Edge */}
					<footer className="mt-auto w-full border-t border-slate-900 bg-slate-950 text-white">
						<div className="mx-auto flex w-full flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-slate-400 sm:flex-row sm:px-6 md:text-sm lg:px-8">
							<div className="text-center sm:text-left">
								© 2026 Team Kito. All rights reserved.
							</div>
							<div className="text-center font-medium tracking-wide sm:text-right">
								Hackathon X DIGDAYA 2026 – Bank Indonesia
							</div>
						</div>
					</footer>
				</section>
			</main>
		</div>
	);
}
