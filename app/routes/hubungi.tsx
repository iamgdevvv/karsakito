import {
	Container,
	Grid,
	Image,
	Text,
	Badge,
	Button,
	Title,
	Box,
	Group,
	Card,
	TextInput,
	Textarea,
	Stack,
	ThemeIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { authGetSession } from '~app-server/session';
import { Header } from '~app-ui/layouts/header';
import { cloudflareContext } from '~workers/app';

import type { Route } from './+types/hubungi';

export async function loader({ request, context }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	return {
		user,
		noIndex: context.get(cloudflareContext).env.NODE_ENV !== 'production',
	};
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
					<Box
						bg="linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
						pt={{ base: 140, md: 180 }}
						pb={{ base: 120, md: 160 }}
						c="white"
						ta="center"
					>
						<Container size="md">
							<Badge
								color="blue"
								variant="filled"
								size="lg"
								mb="md"
								radius="xl"
							>
								Hubungi Kami
							</Badge>
							<Title
								order={1}
								size="3.5rem"
								fw={900}
								mb="md"
								style={{ letterSpacing: '-0.02em' }}
							>
								Mari Bicara dengan Kami
							</Title>
							<Text
								size="xl"
								opacity={0.8}
								maw={600}
								mx="auto"
								fw={300}
								style={{ lineHeight: 1.6 }}
							>
								Kami percaya pelestarian budaya dimulai dari kolaborasi yang erat.
								Beritahu kami kebutuhan Anda, kami senang menjadi bagian dari
								kesuksesan Anda.
							</Text>
						</Container>
					</Box>

					<Container
						size="lg"
						style={{ marginTop: '-60px', zIndex: 10, position: 'relative' }}
					>
						<Grid
							gap={40}
							align="stretch"
						>
							{/* Left Column: Contact info */}
							<Grid.Col span={{ base: 12, md: 5 }}>
								<Card
									shadow="md"
									padding="xl"
									radius="lg"
									withBorder
									style={{ height: '100%', backgroundColor: 'white' }}
								>
									<Title
										order={2}
										size="1.8rem"
										fw={800}
										mb="md"
										c="dark.8"
									>
										Info Kontak
									</Title>
									<Text
										size="sm"
										c="dimmed"
										mb="xl"
									>
										Jangan ragu untuk menghubungi kami melalui detail di bawah
										ini atau mengisi formulir kontak.
									</Text>

									<Stack gap="xl">
										<Group
											align="flex-start"
											wrap="nowrap"
										>
											<ThemeIcon
												size={44}
												radius="md"
												color="blue"
												variant="light"
												style={{ flexShrink: 0 }}
											>
												<FiMail size={20} />
											</ThemeIcon>
											<div>
												<Text
													fw={700}
													size="sm"
													c="dark.8"
												>
													Email Resmi
												</Text>
												<Text
													size="sm"
													c="dimmed"
												>
													info@karsakito.ai
												</Text>
												<Text
													size="sm"
													c="dimmed"
												>
													kemitraan@karsakito.ai
												</Text>
											</div>
										</Group>

										<Group
											align="flex-start"
											wrap="nowrap"
										>
											<ThemeIcon
												size={44}
												radius="md"
												color="blue"
												variant="light"
												style={{ flexShrink: 0 }}
											>
												<FiPhone size={20} />
											</ThemeIcon>
											<div>
												<Text
													fw={700}
													size="sm"
													c="dark.8"
												>
													Telepon & WhatsApp
												</Text>
												<Text
													size="sm"
													c="dimmed"
												>
													+62 812-3456-7890 (Kantor)
												</Text>
												<Text
													size="sm"
													c="dimmed"
												>
													+62 896-1871-1317 (KarsaKito WhatsApp)
												</Text>
											</div>
										</Group>

										<Group
											align="flex-start"
											wrap="nowrap"
										>
											<ThemeIcon
												size={44}
												radius="md"
												color="blue"
												variant="light"
												style={{ flexShrink: 0 }}
											>
												<FiMapPin size={20} />
											</ThemeIcon>
											<div>
												<Text
													fw={700}
													size="sm"
													c="dark.8"
												>
													Alamat Kantor
												</Text>
												<Text
													size="sm"
													c="dimmed"
													style={{ lineHeight: 1.6 }}
												>
													PT. Sinergi Karsa Nusantara
													<br />
													Rumah Budaya KarsaKito, Jl. Khatib Sulaiman No.
													42, Padang, Sumatera Barat, Indonesia
												</Text>
											</div>
										</Group>
									</Stack>
								</Card>
							</Grid.Col>

							{/* Right Column: Form */}
							<Grid.Col span={{ base: 12, md: 7 }}>
								<Card
									shadow="md"
									padding="xl"
									radius="lg"
									withBorder
									style={{ backgroundColor: 'white' }}
								>
									<Title
										order={2}
										size="1.8rem"
										fw={800}
										mb="xs"
										c="dark.8"
									>
										Kirim Pesan
									</Title>
									<Text
										size="sm"
										c="dimmed"
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
														label="Nama Lengkap"
														placeholder="Nama Anda"
														required
														{...form.getInputProps('name')}
														radius="md"
													/>
												</Grid.Col>
												<Grid.Col span={{ base: 12, sm: 6 }}>
													<TextInput
														label="Alamat Email"
														placeholder="nama@email.com"
														required
														{...form.getInputProps('email')}
														radius="md"
													/>
												</Grid.Col>
											</Grid>

											<Grid gap="md">
												<Grid.Col span={{ base: 12, sm: 6 }}>
													<TextInput
														label="Nomor WhatsApp"
														placeholder="0812xxxxxx"
														required
														{...form.getInputProps('phone')}
														radius="md"
													/>
												</Grid.Col>
												<Grid.Col span={{ base: 12, sm: 6 }}>
													<TextInput
														label="Nama Instansi / Komunitas"
														placeholder="Nama organisasi (opsional)"
														{...form.getInputProps('organization')}
														radius="md"
													/>
												</Grid.Col>
											</Grid>

											<Textarea
												label="Pesan Anda"
												placeholder="Tuliskan pertanyaan, ide kolaborasi, atau kebutuhan Anda..."
												minRows={4}
												required
												{...form.getInputProps('message')}
												radius="md"
											/>

											<Button
												type="submit"
												color="blue"
												size="md"
												radius="md"
												rightSection={<FiSend size={16} />}
												mt="xs"
											>
												Kirim Pesan
											</Button>
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
