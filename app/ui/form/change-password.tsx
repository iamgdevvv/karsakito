import { Alert, Box, Button, PasswordInput, Stack, type BoxProps } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { useFetcher } from 'react-router';
import {
	PayloadUpdateProfilePasswordSchema,
	type PayloadUpdateProfilePassword,
} from '~app-modules/schema/user';
import type { ActionChangePassword } from '~app-server/user';

export default function FormChangePassword(props: BoxProps) {
	const fetcher = useFetcher<ActionChangePassword>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isLoading = useMemo(() => {
		return fetcher.state !== 'idle';
	}, [fetcher.state]);

	const form = useForm<PayloadUpdateProfilePassword>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadUpdateProfilePasswordSchema, { sync: true }),
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
			if (fetcher.data.error) {
				setErrorMessage(fetcher.data.error);
			} else if (fetcher.data.data) {
				fetcher.reset();

				notifications.show({
					title: 'Success',
					message: 'Password updated successfully',
				});
			}
		}
	}, [fetcher.data, isLoading]);

	return (
		<Box
			{...props}
			data-slot="FormChangePassword"
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
			<fetcher.Form
				method="post"
				onSubmit={form.onSubmit((values) => {
					setErrorMessage(null);
					fetcher.submit(values, {
						method: 'post',
					});
				})}
			>
				<Stack gap="xs">
					<PasswordInput
						label="Current Password"
						name="curentPassword"
						key={form.key('curentPassword')}
						readOnly={isLoading}
						{...form.getInputProps('curentPassword')}
					/>
					<PasswordInput
						label="New Password"
						name="password"
						key={form.key('password')}
						readOnly={isLoading}
						{...form.getInputProps('password')}
					/>
					<PasswordInput
						label="Confirm New Password"
						name="confirmPassword"
						key={form.key('confirmPassword')}
						readOnly={isLoading}
						{...form.getInputProps('confirmPassword')}
					/>
					<Button
						type="submit"
						fullWidth
						loading={isLoading}
						mt="md"
					>
						Save Password
					</Button>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
