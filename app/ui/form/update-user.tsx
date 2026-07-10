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
import { optionsTimezone, optionsUserRole } from '~app-modules/enum-options';
import {
	PayloadUpdateUserSchema,
	UserSchemaPlain,
	type PayloadUpdateUser,
} from '~app-modules/schema/user';
import type { ActionUpdateUser } from '~app-server/user';
import { ButtonLink } from '~app-ui/components/link';
import type { User } from '~generated/prisma/browser';

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
		const timezone = UserSchemaPlain.shape.timezone.safeParse(data.timezone);

		return {
			userId: data.id,
			name: data.name,
			email: data.email,
			role: data.role,
			isActive: data.isActive,
			timezone: timezone.data,
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
			} else if (fetcher.data.data) {
				notifications.show({
					title: 'Success',
					message: `User ${fetcher.data.data.name} updated successfully`,
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
						data={optionsUserRole}
						{...form.getInputProps('role')}
					/>
					<Select
						label="Timezone"
						name="timezone"
						searchable
						limit={20}
						key={form.key('timezone')}
						readOnly={isLoading}
						data={optionsTimezone}
						{...form.getInputProps('timezone')}
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
					<Group
						gap="xs"
						justify="flex-end"
						mt="md"
					>
						<ButtonLink
							variant="light"
							to={`/admin/users/${data.id}/change-password`}
							loading={isLoading}
						>
							Change Password
						</ButtonLink>
						<Button
							type="submit"
							loading={isLoading}
						>
							Update User
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
