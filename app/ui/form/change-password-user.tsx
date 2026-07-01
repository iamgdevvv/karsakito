import { Alert, Box, Button, Input, PasswordInput, Stack, type BoxProps } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { useFetcher, useNavigate } from 'react-router';
import {
	PayloadUpdateUserPasswordSchema,
	type PayloadUpdateUserPassword,
} from '~app-modules/schema/user';
import type { ActionUpdateUserPassword } from '~app-server/user';
import { type User } from '~generated/prisma/browser';

export default function FormChangePasswordUser({
	data,
	...props
}: BoxProps & {
	data: User;
}) {
	const navigate = useNavigate();
	const fetcher = useFetcher<ActionUpdateUserPassword>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isLoading = useMemo(() => {
		return fetcher.state !== 'idle';
	}, [fetcher.state]);

	const form = useForm<PayloadUpdateUserPassword>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadUpdateUserPasswordSchema, { sync: true }),
		onSubmitPreventDefault: 'validation-failed',
		onValuesChange: () => {
			if (errorMessage) {
				fetcher.reset();
				setErrorMessage(null);
			}
		},
	});

	useEffect(() => {
		form.setFieldValue('userId', data.id);
	}, [data.id]);

	useEffect(() => {
		notifications.clean();

		if (!isLoading && fetcher.data) {
			if ('error' in fetcher.data && fetcher.data.error) {
				setErrorMessage(fetcher.data.error);
			} else {
				navigate('/admin/users/' + data.id);
				notifications.show({
					title: 'Success',
					message: 'Change password user successfully',
				});
			}
		}
	}, [fetcher.data, isLoading]);

	return (
		<Box
			{...props}
			data-slot="FormChangePasswordUser"
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
					fetcher.submit(values, {
						method: 'post',
					});
				})}
			>
				<Stack gap="xs">
					<Input
						type="hidden"
						name="userId"
						key={form.key('userId')}
						{...form.getInputProps('userId')}
					/>

					<PasswordInput
						label="New Password"
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
						Save Password
					</Button>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
