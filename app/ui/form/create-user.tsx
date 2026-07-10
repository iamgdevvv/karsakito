import {
	Alert,
	Box,
	Button,
	Checkbox,
	Group,
	PasswordInput,
	Select,
	Stack,
	TextInput,
	type BoxProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { useFetcher, useNavigate } from 'react-router';
import { optionsUserRole } from '~app-modules/enum-options';
import { PayloadCreateUserSchema, type PayloadCreateUser } from '~app-modules/schema/user';
import type { ActionCreateUser } from '~app-server/user';

export default function FormCreateUser(props: BoxProps) {
	const navigate = useNavigate();
	const fetcher = useFetcher<ActionCreateUser>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isLoading = useMemo(() => {
		return fetcher.state !== 'idle';
	}, [fetcher.state]);

	const form = useForm<PayloadCreateUser>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadCreateUserSchema, { sync: true }),
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
				setErrorMessage(fetcher.data.error);
			} else if (fetcher.data?.data) {
				notifications.show({
					title: 'Success',
					message: 'User created successfully',
				});

				navigate(
					`/admin/users?role=${fetcher.data.data.role}&isActive=${fetcher.data.data.isActive}&desc=createdAt&successMessage=User created successfully`,
				);
			}
		}
	}, [fetcher.data, isLoading]);

	return (
		<Box
			{...props}
			data-slot="FormCreateUser"
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
					<Select
						label="Role"
						name="role"
						key={form.key('role')}
						readOnly={isLoading}
						data={optionsUserRole}
						{...form.getInputProps('role')}
					/>
					<Checkbox
						label="Activate User"
						name="isActive"
						key={form.key('isActive')}
						readOnly={isLoading}
						{...form.getInputProps('isActive', {
							type: 'checkbox',
						})}
					/>
					<PasswordInput
						label="Password"
						name="password"
						key={form.key('password')}
						readOnly={isLoading}
						{...form.getInputProps('password')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Create User
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
