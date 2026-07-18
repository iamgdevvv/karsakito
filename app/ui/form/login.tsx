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
import { useEffect, useMemo, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useFetcher, useSearchParams } from 'react-router';
import { PayloadLoginSchema, type PayloadLogin } from '~app-modules/schema/auth';
import { queryParamsToString } from '~app-modules/utils';
import type { ActionLogin } from '~app-server/auth';
import { Image } from '~app-ui/components/image';
import { Link } from '~app-ui/components/link';

export default function FormLogin(props: BoxProps) {
	const [searchParams] = useSearchParams();
	const fetcher = useFetcher<ActionLogin>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isLoading = useMemo(() => {
		return fetcher.state !== 'idle';
	}, [fetcher.state]);

	const form = useForm<PayloadLogin>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadLoginSchema, { sync: true }),
		onSubmitPreventDefault: 'validation-failed',
		onValuesChange: () => {
			if (errorMessage) {
				fetcher.reset();
				setErrorMessage(null);
			}
		},
	});

	useEffect(() => {
		if (!isLoading && fetcher.data && 'error' in fetcher.data) {
			form.reset();

			setErrorMessage(fetcher.data.error);
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
			data-slot="FormLogin"
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
					Masuk
				</Title>
				<Text size="sm">Masukkan alamat email dan kata sandi Anda.</Text>
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
					e?.preventDefault();
					setErrorMessage(null);
					fetcher.submit(values, {
						method: 'post',
					});
				})}
			>
				<Stack gap="xs">
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
						placeholder="Masukkan kata sandi"
						name="password"
						autoComplete="current-password"
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
						Masuk
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
				Masuk dengan Google (belum tersedia)
			</Button>
			<Text
				span
				display="inline-block"
				ta="center"
				fz="sm"
				mt="lg"
			>
				Belum punya akun?{' '}
				<Link
					to={`/register${queryParamsToString(searchParams)}`}
					c="primary"
					td="underline"
				>
					Daftar
				</Link>
			</Text>
		</Box>
	);
}
