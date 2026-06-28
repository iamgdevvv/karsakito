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
import { useShallowEffect } from '@mantine/hooks';
import { useMemo, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useFetcher } from 'react-router';
import { PayloadLoginSchema, type PayloadLogin } from '~app-modules/schema/auth';
import type { ActionFormLogin } from '~app-server/auth';
import { Image } from '~app-ui/components/image';
import { ButtonLink, Link } from '~app-ui/components/link';

export default function FormLogin(props: BoxProps) {
	const fetcher = useFetcher<ActionFormLogin>();
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

	const isLoading = useMemo(() => {
		return fetcher.state !== 'idle';
	}, [fetcher.state]);

	const form = useForm<PayloadLogin>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadLoginSchema, { sync: true }),
		onSubmitPreventDefault: 'validation-failed',
		onValuesChange: () => {
			setErrorMessage(undefined);
		},
	});

	useShallowEffect(() => {
		if (fetcher.data && 'error' in fetcher.data && !isLoading) {
			form.reset();

			setErrorMessage(fetcher.data.error);
		}
	}, [fetcher, isLoading]);

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
		>
			<Center>
				<Image
					src="/logo.svg"
					w={80}
					h="auto"
				/>
			</Center>
			<Stack
				gap="xs"
				mt="xl"
				mb="md"
			>
				<Title
					order={2}
					fz="xl"
				>
					Sign in
				</Title>
				<Text size="sm">Enter your email and password to login to your account</Text>
				{errorMessage ? (
					<Alert
						color="red"
						title="Error"
					>
						{errorMessage}
					</Alert>
				) : null}
			</Stack>
			<fetcher.Form method="post">
				<Stack gap="xs">
					<TextInput
						type="email"
						label="Email"
						name="email"
						key={form.key('email')}
						readOnly={isLoading}
						{...form.getInputProps('email')}
					/>
					<PasswordInput
						label="Password"
						name="password"
						key={form.key('password')}
						readOnly={isLoading}
						{...form.getInputProps('password')}
					/>
					<Button
						type="submit"
						fullWidth
						loading={isLoading}
						mt="md"
					>
						Login
					</Button>
				</Stack>
			</fetcher.Form>
			<Divider
				label={
					<Text
						span
						fz={10}
					>
						OR CONTINUE WITH
					</Text>
				}
				my="lg"
			/>
			<ButtonLink
				variant="outline"
				to="/login/google"
				fullWidth
				disabled={isLoading}
				leftSection={
					<FaGoogle
						size={20}
						color="currentColor"
					/>
				}
			>
				Continue with Google
			</ButtonLink>
			<Text
				span
				display="inline-block"
				ta="center"
				fz="sm"
				mt="lg"
			>
				Don't have an account?{' '}
				<Link
					to="/register"
					c="primary"
					td="underline"
				>
					Sign Up
				</Link>
			</Text>
		</Box>
	);
}
