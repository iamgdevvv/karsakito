import {
	Alert,
	Box,
	Button,
	Checkbox,
	Group,
	NumberInput,
	Select,
	SimpleGrid,
	Stack,
	Textarea,
	TextInput,
	type BoxProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { LuCoins } from 'react-icons/lu';
import { PiCoinsFill } from 'react-icons/pi';
import { useFetcher, useNavigate } from 'react-router';
import { labelAppName, optionsAppCategory, optionsAppName } from '~app-modules/enum-options';
import { PayloadCreateKarsaAppSchema, type PayloadCreateKarsaApp } from '~app-modules/schema/app';
import type { ActionCreateKarsaApp } from '~app-server/app';

export default function FormCreateKarsaApp(props: BoxProps) {
	const navigate = useNavigate();
	const fetcher = useFetcher<ActionCreateKarsaApp>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isLoading = useMemo(() => {
		return fetcher.state !== 'idle';
	}, [fetcher.state]);

	const form = useForm<PayloadCreateKarsaApp>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadCreateKarsaAppSchema, { sync: true }),
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
				redirectParams.set('desc', 'createdAt');
				redirectParams.set(
					'successMessage',
					`Aplikasi ${labelAppName[fetcher.data.data.name]} berhasil dibuat.`,
				);

				navigate(`/admin/apps?${redirectParams.toString()}`);
			}
		}
	}, [fetcher.data, isLoading]);

	return (
		<Box
			{...props}
			data-slot="FormCreateKarsaApp"
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
						label="Nama Aplikasi"
						placeholder="Pilih Aplikasi"
						name="name"
						key={form.key('name')}
						readOnly={isLoading}
						required
						data={optionsAppName}
						{...form.getInputProps('name')}
					/>
					<TextInput
						label="Label Aplikasi"
						placeholder="Contoh: Pembuat Pidato"
						name="label"
						key={form.key('label')}
						readOnly={isLoading}
						required
						{...form.getInputProps('label')}
					/>
					<SimpleGrid
						cols={{
							base: 1,
							sm: 2,
						}}
					>
						<NumberInput
							label="Token"
							placeholder="Contoh: 10"
							name="token"
							key={form.key('token')}
							readOnly={isLoading}
							required
							leftSection={<PiCoinsFill size={18} />}
							leftSectionProps={{
								color: 'yellow',
							}}
							{...form.getInputProps('token')}
						/>
						<NumberInput
							label="Token promo"
							placeholder="Contoh: 5"
							name="tokenPromo"
							key={form.key('tokenPromo')}
							readOnly={isLoading}
							leftSection={<LuCoins size={18} />}
							leftSectionProps={{
								color: 'blue',
							}}
							{...form.getInputProps('tokenPromo')}
						/>
					</SimpleGrid>
					<Select
						label="Kategori"
						placeholder="Pilih kategori"
						name="category"
						key={form.key('category')}
						readOnly={isLoading}
						required
						data={optionsAppCategory}
						{...form.getInputProps('category')}
					/>
					<Checkbox
						label="Tampilkan Aplikasi"
						name="visible"
						key={form.key('visible')}
						readOnly={isLoading}
						{...form.getInputProps('visible', {
							type: 'checkbox',
						})}
					/>
					<Textarea
						label="Deskripsi"
						placeholder="Jelaskan manfaat dan cara penggunaan singkat"
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
							Buat Aplikasi
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
