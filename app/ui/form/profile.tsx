import { Alert, Box, Button, Select, Stack, TextInput, type BoxProps } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { useFetcher } from 'react-router';
import { optionsTimezone } from '~app-modules/enum-options';
import { PayloadUpdateProfileSchema, type PayloadUpdateProfile } from '~app-modules/schema/user';
import type { ActionUpdateProfile } from '~app-server/user';
import type { User } from '~generated/prisma/browser';

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
		const timezone = PayloadUpdateProfileSchema.shape.timezone.safeParse(data.timezone);

		return {
			name: data.name,
			email: data.email,
			timezone: timezone.data,
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
					title: 'Berhasil',
					message: 'Profil berhasil diperbarui.',
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
						autoComplete="name"
						key={form.key('name')}
						readOnly={isLoading}
						{...form.getInputProps('name')}
					/>
					<TextInput
						type="email"
						label="Alamat email"
						placeholder="nama@contoh.com"
						name="email"
						autoComplete="email"
						spellCheck={false}
						key={form.key('email')}
						readOnly={isLoading}
						{...form.getInputProps('email')}
					/>
					<Select
						label="Zona waktu"
						placeholder="Pilih zona waktu"
						name="timezone"
						searchable
						key={form.key('timezone')}
						readOnly={isLoading}
						data={optionsTimezone}
						{...form.getInputProps('timezone')}
					/>
					<Button
						type="submit"
						fullWidth
						loading={isLoading}
						mt="md"
					>
						Simpan Perubahan
					</Button>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
