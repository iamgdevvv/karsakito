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
import { useFetcher, useNavigate } from 'react-router';
import { PayloadRegisterSchema, type PayloadRegister } from '~app-modules/schema/auth';
import type { ActionRegister } from '~app-server/auth';
import { Image } from '~app-ui/components/image';
import { ButtonLink, Link } from '~app-ui/components/link';

export default function FormRegister(props: BoxProps) {
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

		if (!isLoading) {
			if (fetcher.data?.error) {
				form.reset();

				setErrorMessage(fetcher.data.error);
			} else if (fetcher.data?.data) {
				notifications.show({
					title: 'Success',
					message: 'You have successfully registered.',
				});

				navigate('/login', {
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
				<Link to="/">
					<Image
						src="/logo.svg"
						w={80}
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
					Sign up
				</Title>
				<Text size="sm">Create a new account</Text>
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
						label="Name"
						name="name"
						key={form.key('name')}
						readOnly={isLoading}
						{...form.getInputProps('name')}
					/>
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
						Register
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
				Already have an account?{' '}
				<Link
					to="/login"
					c="primary"
					td="underline"
				>
					Sign in
				</Link>
			</Text>
		</Box>
	);
}
