import {
	Anchor,
	Box,
	Button,
	Card,
	Container,
	Grid,
	Group,
	Stack,
	Text,
	TextInput,
	Textarea,
	ThemeIcon,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';
import { metaPublicRoute } from '~app-modules/meta';
import { cfContext } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import Banner from '~app-ui/layouts/banner';
import { Header } from '~app-ui/layouts/header';

import type { Route } from './+types/hubungi';

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
		title: 'Hubungi KarsaKito',
		noIndex: loaderData.noIndex,
	});
}

export default function Hubungi({ loaderData }: Route.ComponentProps) {
	const form = useForm({
		initialValues: {
			name: '',
			email: '',
			phone: '',
			organization: '',
			message: '',
		},
		validate: {
			name: (value) => (value.trim().length < 2 ? 'Nama harus diisi' : null),
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email tidak valid'),
			phone: (value) => (value.trim().length < 5 ? 'Nomor telepon tidak valid' : null),
			message: (value) => (value.trim().length < 10 ? 'Pesan minimal 10 karakter' : null),
		},
	});

	const handleSubmit = (values: typeof form.values) => {
		console.log(values);
		alert('Pesan Anda berhasil dikirim! Tim kami akan menghubungi Anda segera.');
		form.reset();
	};

	return (
		<div className="site">
			<Header authUser={loaderData.user} />
			<main className="site-main">
				<Box
					bg="gray.0"
					pb={80}
					style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
				>
					{/* Hero Section */}
					<Banner
						background="/images/karsakito-beranda-banner.jpg"
						ta="center"
						justify="center"
						pb="xl"
					>
						<Text
							span
							size="xs"
							fw={700}
							c="primary"
							tt="uppercase"
						>
							Hubungi Kami
						</Text>
						<Title>Mari Bicara dengan Kami</Title>
						<Text>
							Kami percaya pelestarian budaya dimulai dari kolaborasi yang erat.
							Beritahu kami kebutuhan Anda, kami senang menjadi bagian dari kesuksesan
							Anda.
						</Text>
					</Banner>

					<Container
						size="lg"
						style={{ marginTop: '-60px', zIndex: 10, position: 'relative' }}
					>
						<Grid
							gap="xl"
							align="stretch"
						>
							{/* Left Column: Contact info */}
							<Grid.Col span={{ base: 12, md: 5 }}>
								<Card
									shadow="md"
									padding="xl"
									radius="xl"
									withBorder
									bg="white"
									h="100%"
								>
									<Title
										order={2}
										mb="md"
									>
										Info Kontak
									</Title>
									<Text
										c="gray.6"
										mb="xl"
									>
										Jangan ragu untuk menghubungi kami melalui detail di bawah
										ini atau mengisi formulir kontak.
									</Text>

									<Stack>
										<Group
											align="flex-start"
											wrap="nowrap"
										>
											<ThemeIcon
												size={44}
												variant="light"
												style={{ flexShrink: 0 }}
											>
												<FiMail size={20} />
											</ThemeIcon>
											<Stack gap={4}>
												<Text
													span
													fw={700}
													size="sm"
												>
													Email Resmi
												</Text>
												<Anchor
													href="mailto:info@karsakito.ai"
													target="_blank"
													size="sm"
													underline="hover"
												>
													info@karsakito.ai
												</Anchor>
												<Anchor
													href="mailto:kemitraan@karsakito.ai"
													target="_blank"
													size="sm"
													underline="hover"
												>
													kemitraan@karsakito.ai
												</Anchor>
											</Stack>
										</Group>

										<Group
											align="flex-start"
											wrap="nowrap"
										>
											<ThemeIcon
												size={44}
												variant="light"
												style={{ flexShrink: 0 }}
											>
												<FiPhone size={20} />
											</ThemeIcon>
											<Stack gap={4}>
												<Text
													span
													fw={700}
													size="sm"
												>
													Telepon & WhatsApp
												</Text>
												<Anchor
													href="tel:+6281234567890"
													target="_blank"
													size="sm"
													underline="hover"
												>
													+62 812-3456-7890 (Kantor)
												</Anchor>
												<Anchor
													href="tel:+6289618711317"
													target="_blank"
													size="sm"
													underline="hover"
												>
													+62 896-1871-1317 (KarsaKito WhatsApp)
												</Anchor>
											</Stack>
										</Group>

										<Group
											align="flex-start"
											wrap="nowrap"
										>
											<ThemeIcon
												size={44}
												variant="light"
												style={{ flexShrink: 0 }}
											>
												<FiMapPin size={20} />
											</ThemeIcon>
											<Stack gap={4}>
												<Text
													span
													fw={700}
													size="sm"
												>
													Alamat Kantor
												</Text>
												<Text
													size="sm"
													c="gray.6"
												>
													PT. Sinergi Karsa Nusantara
													<br />
													Rumah Budaya KarsaKito, Jl. Khatib Sulaiman No.
													42, Padang, Sumatera Barat, Indonesia
												</Text>
											</Stack>
										</Group>
									</Stack>
								</Card>
							</Grid.Col>

							{/* Right Column: Form */}
							<Grid.Col span={{ base: 12, md: 7 }}>
								<Card
									shadow="md"
									padding="xl"
									radius="xl"
									withBorder
									bg="white"
								>
									<Title
										order={2}
										mb="xs"
									>
										Kirim Pesan
									</Title>
									<Text
										c="gray.6"
										mb="lg"
									>
										Isi formulir berikut dan tim kami akan segera menghubungi
										Anda kembali dalam waktu 1x24 jam.
									</Text>

									<form onSubmit={form.onSubmit(handleSubmit)}>
										<Stack gap="md">
											<Grid gap="md">
												<Grid.Col span={{ base: 12, sm: 6 }}>
													<TextInput
														key={form.key('name')}
														label="Nama Lengkap"
														placeholder="Nama Anda"
														{...form.getInputProps('name')}
													/>
												</Grid.Col>
												<Grid.Col span={{ base: 12, sm: 6 }}>
													<TextInput
														key={form.key('email')}
														label="Alamat Email"
														placeholder="nama@email.com"
														{...form.getInputProps('email')}
													/>
												</Grid.Col>
											</Grid>

											<Grid gap="md">
												<Grid.Col span={{ base: 12, sm: 6 }}>
													<TextInput
														key={form.key('phone')}
														label="Nomor WhatsApp"
														placeholder="0812xxxxxx"
														{...form.getInputProps('phone')}
													/>
												</Grid.Col>
												<Grid.Col span={{ base: 12, sm: 6 }}>
													<TextInput
														key={form.key('organization')}
														label="Nama Instansi / Komunitas"
														placeholder="Nama organisasi (opsional)"
														{...form.getInputProps('organization')}
													/>
												</Grid.Col>
											</Grid>

											<Textarea
												key={form.key('message')}
												label="Pesan Anda"
												placeholder="Tuliskan pertanyaan, ide kolaborasi, atau kebutuhan Anda..."
												minRows={4}
												{...form.getInputProps('message')}
											/>

											<Group
												justify="flex-end"
												mt="xs"
											>
												<Button
													type="submit"
													rightSection={<FiSend size={16} />}
												>
													Kirim Pesan
												</Button>
											</Group>
										</Stack>
									</form>
								</Card>
							</Grid.Col>
						</Grid>
					</Container>
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
			</main>
		</div>
	);
}
