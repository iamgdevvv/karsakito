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
import { optionsTimezone, optionsUserRole } from '~app-modules/enum-options';
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

		if (!isLoading && fetcher.data) {
			if (fetcher.data?.error) {
				setErrorMessage(fetcher.data.error);
			} else if (fetcher.data?.data) {
				const redirectParams = new URLSearchParams();
				redirectParams.set('isActive', fetcher.data.data.isActive.toString());
				redirectParams.set('desc', 'createdAt');
				redirectParams.set(
					'successMessage',
					`Pengguna ${fetcher.data.data.name} berhasil dibuat.`,
				);

				navigate(`/admin/users?${redirectParams.toString()}`);
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
					title="Terjadi kendala"
					mb="md"
				>
					{errorMessage}
				</Alert>
			) : null}
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
						label="Nama"
						placeholder="Contoh: Sari Wulandari"
						name="name"
						key={form.key('name')}
						readOnly={isLoading}
						required
						{...form.getInputProps('name')}
					/>
					<TextInput
						type="email"
						label="Alamat email"
						placeholder="nama@contoh.com"
						name="email"
						key={form.key('email')}
						readOnly={isLoading}
						required
						{...form.getInputProps('email')}
					/>
					<Select
						label="Peran"
						placeholder="Pilih peran"
						name="role"
						key={form.key('role')}
						readOnly={isLoading}
						required
						data={optionsUserRole}
						{...form.getInputProps('role')}
					/>
					<Select
						label="Zona waktu"
						placeholder="Pilih zona waktu"
						name="timezone"
						searchable
						key={form.key('timezone')}
						readOnly={isLoading}
						required
						data={optionsTimezone}
						{...form.getInputProps('timezone')}
					/>
					<Checkbox
						label="Aktifkan Pengguna"
						name="isActive"
						key={form.key('isActive')}
						readOnly={isLoading}
						{...form.getInputProps('isActive', {
							type: 'checkbox',
						})}
					/>
					<PasswordInput
						label="Kata sandi"
						placeholder="Masukkan kata sandi"
						name="password"
						key={form.key('password')}
						readOnly={isLoading}
						required
						{...form.getInputProps('password')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Buat Pengguna
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
