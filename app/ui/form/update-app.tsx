import {
	Alert,
	Box,
	Button,
	Checkbox,
	Group,
	Input,
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
import { useFetcher } from 'react-router';
import { labelAppName, optionsAppCategory, optionsAppName } from '~app-modules/enum-options';
import {
	PayloadUpdateKarsaAppSchema,
	type KarsaAppPlain,
	type PayloadUpdateKarsaApp,
} from '~app-modules/schema/app';
import type { ActionUpdateKarsaApp } from '~app-server/app';

export default function FormUpdateApp({
	data,
	...props
}: BoxProps & {
	data: KarsaAppPlain;
}) {
	const fetcher = useFetcher<ActionUpdateKarsaApp>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isLoading = useMemo(() => {
		return fetcher.state !== 'idle';
	}, [fetcher.state]);

	const initialValues = useMemo((): PayloadUpdateKarsaApp => {
		return {
			karsaAppId: data.id,
			name: data.name,
			label: data.label,
			category: data.category,
			description: data.description,
			token: data.token,
			tokenPromo: data.tokenPromo,
			visible: data.visible,
		};
	}, [data]);

	const form = useForm<PayloadUpdateKarsaApp>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadUpdateKarsaAppSchema, { sync: true }),
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
					title: 'Berhasil',
					message: `Aplikasi ${labelAppName[fetcher.data.data.name]} berhasil diperbarui.`,
				});
			}
		}
	}, [fetcher.data, isLoading]);

	return (
		<Box
			{...props}
			data-slot="FormUpdateApp"
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
					<Input
						type="hidden"
						name="karsaAppId"
						key={form.key('karsaAppId')}
						{...form.getInputProps('karsaAppId')}
					/>
					<Select
						label="Nama Aplikasi"
						placeholder="Pilih Aplikasi"
						name="name"
						key={form.key('name')}
						readOnly={isLoading}
						data={optionsAppName}
						{...form.getInputProps('name')}
					/>
					<TextInput
						label="Label Aplikasi"
						placeholder="Contoh: Pembuat Pidato"
						name="label"
						key={form.key('label')}
						readOnly={isLoading}
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
					<Group
						gap="xs"
						justify="flex-end"
						mt="md"
					>
						<Button
							type="submit"
							loading={isLoading}
						>
							Simpan perubahan
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
