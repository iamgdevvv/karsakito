import { Alert, Box, Button, Stack, TextInput, type BoxProps } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { useFetcher } from 'react-router';
import { PayloadUpdateProfileSchema, type PayloadUpdateProfile } from '~app-modules/schema/user';
import type { ActionUpdateProfile } from '~app-server/user';
import type { User } from '~generated/prisma/client';

export default function FormProfile({
	data,
	...props
}: BoxProps & {
	data: User;
}) {
	const fetcher = useFetcher<ActionUpdateProfile>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isLoading = useMemo(() => {
		return fetcher.state !== 'idle';
	}, [fetcher.state]);

	const initialValues = useMemo((): PayloadUpdateProfile => {
		return {
			name: data.name,
			email: data.email,
		};
	}, [data]);

	const form = useForm<PayloadUpdateProfile>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadUpdateProfileSchema, { sync: true }),
		onSubmitPreventDefault: 'validation-failed',
		initialValues,
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
			if ('error' in fetcher.data) {
				form.setValues(initialValues);

				setErrorMessage(fetcher.data.error);
			} else {
				notifications.show({
					title: 'Success',
					message: 'Profile updated successfully',
				});
			}
		}
	}, [fetcher.data, isLoading]);

	return (
		<Box
			{...props}
			data-slot="FormProfile"
		>
			{errorMessage ? (
				<Alert
					color="red"
					title="Error"
					mb="md"
				>
					{errorMessage}
				</Alert>
			) : null}
			<fetcher.Form method="post">
				<Stack gap="xs">
					<TextInput
						label="Nama"
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
					<Button
						type="submit"
						fullWidth
						loading={isLoading}
						mt="md"
					>
						Update Profile
					</Button>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
