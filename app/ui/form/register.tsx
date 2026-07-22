import {
	Alert,
	Box,
	Button,
	Center,
	Divider,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	Title,
	type BoxProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useFetcher, useNavigate, useSearchParams } from 'react-router';
import { PayloadRegisterSchema, type PayloadRegister } from '~app-modules/schema/auth';
import { queryParamsToString } from '~app-modules/utils';
import type { ActionRegister } from '~app-server/auth';
import { Image } from '~app-ui/components/image';
import { Link } from '~app-ui/components/link';

export default function FormRegister(props: BoxProps) {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const fetcher = useFetcher<ActionRegister>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isLoading = useMemo(() => {
		return fetcher.state !== 'idle';
	}, [fetcher.state]);

	const form = useForm<PayloadRegister>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadRegisterSchema, { sync: true }),
		onSubmitPreventDefault: 'validation-failed',
		onValuesChange: () => {
			if (errorMessage) {
				fetcher.reset();
				setErrorMessage(null);
			}
		},
	});

	useEffect(() => {
		notifications.clean();

		if (!isLoading && fetcher.data) {
			if (fetcher.data?.error) {
				form.reset();

				setErrorMessage(fetcher.data.error);
			} else if (fetcher.data?.data) {
				const redirectParams = new URLSearchParams(searchParams);
				redirectParams.set('successMessage', 'Pendaftaran berhasil. Silakan masuk.');

				navigate(`/login?${redirectParams.toString()}`, {
					replace: true,
				});
			}
		}
	}, [fetcher.data, isLoading]);

	return (
		<Box
			p={{
				base: 'lg',
				md: 'xl',
			}}
			bg="white"
			bdrs="2xl"
			bd="1px solid gray.4"
			{...props}
			data-slot="FormRegister"
		>
			<Center>
				<Link
					to="/"
					aria-label="Beranda KarsaKito"
				>
					<Image
						src="/logo.svg"
						loading="eager"
						width={144}
						height={57}
						w={{
							base: 56,
							lg: 64,
						}}
						h="auto"
					/>
				</Link>
			</Center>
			<Stack
				gap="xs"
				mt="xl"
				mb="md"
			>
				<Title
					order={1}
					fz="xl"
				>
					Daftar
				</Title>
				<Text size="sm">Buat akun untuk mulai menggunakan KarsaKito.</Text>
				{errorMessage ? (
					<Alert
						color="red"
						title="Terjadi kendala"
					>
						{errorMessage}
					</Alert>
				) : null}
			</Stack>
			<fetcher.Form
				method="post"
				onSubmit={form.onSubmit((values, e) => {
					setErrorMessage(null);
					e?.preventDefault();
					fetcher.submit(values, {
						method: 'post',
					});
				})}
			>
				<Stack gap="xs">
					<TextInput
						label="Nama"
						placeholder="Contoh: Sari Wulandari"
						name="name"
						autoComplete="name"
						key={form.key('name')}
						readOnly={isLoading}
						required
						{...form.getInputProps('name')}
					/>
					<TextInput
						type="email"
						label="Alamat email"
						placeholder="nama@contoh.com"
						name="email"
						autoComplete="email"
						spellCheck={false}
						key={form.key('email')}
						readOnly={isLoading}
						required
						{...form.getInputProps('email')}
					/>
					<PasswordInput
						label="Kata sandi"
						placeholder="Buat kata sandi untuk akun Anda"
						name="password"
						autoComplete="new-password"
						key={form.key('password')}
						readOnly={isLoading}
						required
						{...form.getInputProps('password')}
					/>
					<Button
						type="submit"
						fullWidth
						fz="md"
						loading={isLoading}
						mt="md"
					>
						Daftar
					</Button>
				</Stack>
			</fetcher.Form>
			<Divider
				label={
					<Text
						span
						fz={10}
					>
						ATAU LANJUTKAN DENGAN
					</Text>
				}
				my="lg"
			/>
			<Button
				variant="outline"
				fullWidth
				disabled
				leftSection={
					<FaGoogle
						size={20}
						color="currentColor"
					/>
				}
			>
				Daftar dengan Google (belum tersedia)
			</Button>
			<Text
				span
				display="inline-block"
				ta="center"
				fz="sm"
				mt="lg"
			>
				Sudah punya akun?{' '}
				<Link
					to={`/login${queryParamsToString(searchParams)}`}
					c="primary"
					td="underline"
				>
					Masuk
				</Link>
			</Text>
		</Box>
	);
}
