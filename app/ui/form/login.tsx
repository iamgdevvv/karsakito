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
				<Link to="/">
					<Image
						src="/logo.svg"
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
			<fetcher.Form
				method="post"
				onSubmit={form.onSubmit((values) => {
					fetcher.submit(values, {
						method: 'post',
					});
				})}
			>
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
						fz="md"
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
				Continue with Google (Soon)
			</Button>
			<Text
				span
				display="inline-block"
				ta="center"
				fz="sm"
				mt="lg"
			>
				Don't have an account?{' '}
				<Link
					to={`/register${queryParamsToString(searchParams)}`}
					c="primary"
					td="underline"
				>
					Sign Up
				</Link>
			</Text>
		</Box>
	);
}
