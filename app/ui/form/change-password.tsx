import { Alert, Box, Button, PasswordInput, Stack, type BoxProps } from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { useFetcher, useNavigate } from 'react-router';
import {
	PayloadUpdateProfilePasswordSchema,
	type PayloadUpdateProfilePassword,
} from '~app-modules/schema/user';
import type { ActionChangePassword } from '~app-server/user';

export default function FormChangePassword(props: BoxProps) {
	const navigate = useNavigate();
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
				const redirectParams = new URLSearchParams();
				redirectParams.set('successMessage', 'Kata sandi berhasil diperbarui.');

				navigate(`/dashboard/profile/?${redirectParams.toString()}`);
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
					<PasswordInput
						label="Kata sandi saat ini"
						placeholder="Masukkan kata sandi saat ini"
						name="curentPassword"
						autoComplete="current-password"
						key={form.key('curentPassword')}
						readOnly={isLoading}
						required
						{...form.getInputProps('curentPassword')}
					/>
					<PasswordInput
						label="Kata sandi baru"
						placeholder="Masukkan kata sandi baru"
						name="password"
						autoComplete="new-password"
						key={form.key('password')}
						readOnly={isLoading}
						required
						{...form.getInputProps('password')}
					/>
					<PasswordInput
						label="Konfirmasi kata sandi baru"
						placeholder="Masukkan kembali kata sandi baru"
						name="confirmPassword"
						autoComplete="new-password"
						key={form.key('confirmPassword')}
						readOnly={isLoading}
						required
						{...form.getInputProps('confirmPassword')}
					/>
					<Button
						type="submit"
						fullWidth
						loading={isLoading}
						mt="md"
					>
						Simpan kata sandi
					</Button>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
