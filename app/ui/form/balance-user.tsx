import {
	Alert,
	Box,
	Button,
	Group,
	NumberInput,
	Select,
	Stack,
	Textarea,
	type BoxProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { PiCoinsFill } from 'react-icons/pi';
import { useFetcher, useNavigate } from 'react-router';
import { PayloadUpdateBalanceSchema, type PayloadUpdateBalance } from '~app-modules/schema/balance';
import type { ActionUpdateBalanceUser } from '~app-server/balance';

export default function FormBalanceUser({
	userId,
	...props
}: BoxProps & {
	userId: string;
}) {
	const navigate = useNavigate();
	const fetcher = useFetcher<ActionUpdateBalanceUser>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isLoading = useMemo(() => {
		return fetcher.state !== 'idle';
	}, [fetcher.state]);

	const form = useForm<PayloadUpdateBalance>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadUpdateBalanceSchema, { sync: true }),
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
				redirectParams.set('successMessage', 'Saldo Token berhasil diperbarui.');

				navigate(`/admin/users/${userId}/balance?${redirectParams.toString()}`);
			}
		}
	}, [fetcher.data, isLoading]);

	return (
		<Box
			{...props}
			data-slot="FormBalanceUser"
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
					<Select
						label="Jenis aktivitas"
						placeholder="Pilih jenis aktivitas"
						name="type"
						key={form.key('type')}
						readOnly={isLoading}
						required
						data={[
							{ value: 'DAILY_BONUS', label: 'Bonus Harian' },
							{ value: 'GIVEAWAY', label: 'Hadiah' },
							{ value: 'PURCHASE', label: 'Pembelian Token' },
						]}
						{...form.getInputProps('type')}
					/>
					<NumberInput
						label={form.values.type === 'DAILY_BONUS' ? 'Token Harian' : 'Token'}
						placeholder="Contoh: 100"
						name="token"
						key={form.key('token')}
						readOnly={isLoading}
						required
						leftSection={<PiCoinsFill size={18} />}
						{...form.getInputProps('token')}
					/>
					<Textarea
						label="Keterangan"
						placeholder="Contoh: Penyesuaian saldo Token"
						name="description"
						key={form.key('description')}
						readOnly={isLoading}
						{...form.getInputProps('description')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Simpan perubahan Token
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
