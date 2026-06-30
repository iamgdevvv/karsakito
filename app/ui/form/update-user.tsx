import {
	Alert,
	Box,
	Button,
	Checkbox,
	Group,
	Input,
	Select,
	Stack,
	TextInput,
	type BoxProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { useFetcher } from 'react-router';
import { PayloadUpdateUserSchema, type PayloadUpdateUser } from '~app-modules/schema/user';
import type { ActionUpdateUser } from '~app-server/user';
import type { User } from '~generated/prisma/client';
import { UserRole } from '~generated/prisma/enums';

export default function FormUpdateUser({
	data,
	...props
}: BoxProps & {
	data: User;
}) {
	const fetcher = useFetcher<ActionUpdateUser>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isLoading = useMemo(() => {
		return fetcher.state !== 'idle';
	}, [fetcher.state]);

	const initialValues = useMemo((): PayloadUpdateUser => {
		return {
			userId: data.id,
			name: data.name,
			email: data.email,
			role: data.role,
			isActive: data.isActive,
		};
	}, [data]);

	const form = useForm<PayloadUpdateUser>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadUpdateUserSchema, { sync: true }),
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
			if ('error' in fetcher.data && fetcher.data.error) {
				form.setValues(initialValues);

				setErrorMessage(fetcher.data.error);
			} else {
				notifications.show({
					title: 'Success',
					message: 'User updated successfully',
				});
			}
		}
	}, [fetcher.data, isLoading]);

	return (
		<Box
			{...props}
			data-slot="FormUpdateUser"
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
					<Input
						type="hidden"
						name="userId"
						key={form.key('userId')}
						{...form.getInputProps('userId')}
					/>
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
						data={Object.values(UserRole)}
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
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Update User
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
