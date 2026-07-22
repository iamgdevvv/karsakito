import {
	Box,
	Button,
	Select,
	Stack,
	TextInput,
	type BoxProps,
	type ComboboxItem,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useEffect } from 'react';
import { labelAppCategory } from '~app-modules/enum-options';
import {
	PayloadWindowWorkspaceSchema,
	type PayloadWindowWorkspace,
} from '~app-modules/schema/workspace';
import type { KarsaApp } from '~generated/prisma/browser';

export default function FormWindowWorkspace({
	viewMode,
	defaultValues,
	optionApps,
	onSubmit,
	...props
}: BoxProps & {
	viewMode?: 'window' | 'simple';
	defaultValues?: PayloadWindowWorkspace;
	optionApps: Record<
		KarsaApp['category'],
		(ComboboxItem & Pick<KarsaApp, 'description' | 'token' | 'tokenPromo'>)[]
	>;
	onSubmit: (values: PayloadWindowWorkspace) => void;
}) {
	const form = useForm<PayloadWindowWorkspace>({
		validate: schemaResolver(PayloadWindowWorkspaceSchema, { sync: true }),
		initialValues: defaultValues,
	});

	useEffect(() => {
		if (!form.values.id) {
			form.setFieldValue('id', crypto.randomUUID());
		}

		if (!form.values.title) {
			form.setFieldValue('title', 'Window Baru');
		}
	}, []);

	return (
		<Box
			{...props}
			component="form"
			data-slot="FormWindowWorkspace"
			onSubmit={form.onSubmit(onSubmit)}
		>
			<Stack gap={6}>
				{viewMode !== 'simple' ? (
					<TextInput
						label="Judul Window"
						placeholder="Contoh: Draf pidato sambutan"
						size="sm"
						labelProps={{
							fz: 'xs',
						}}
						key={form.key('title')}
						required
						{...form.getInputProps('title')}
					/>
				) : null}

				<Select
					label="Pilih tool"
					placeholder="Pilih tool yang akan digunakan"
					size="sm"
					labelProps={{
						fz: 'xs',
					}}
					data={Object.entries(optionApps).map(([group, items]) => ({
						group: labelAppCategory[group as KarsaApp['category']],
						items: items.map((item) => ({
							...item,
							label: `${item.label}${!item.disabled ? ` 🪙${item.tokenPromo || item.token}` : ''}`,
						})),
					}))}
					key={form.key('app')}
					required
					{...form.getInputProps('app')}
					onChange={(value) => {
						form.getInputProps('app').onChange(value);

						if (viewMode === 'simple') {
							onSubmit({
								...form.values,
								app: value,
							});
						}
					}}
				/>

				{viewMode !== 'simple' ? (
					<Button
						type="submit"
						size="md"
						fz="sm"
						mt={6}
						disabled={!form.isValid() || Object.keys(form.errors).length > 0}
					>
						Buat Window
					</Button>
				) : null}
			</Stack>
		</Box>
	);
}
