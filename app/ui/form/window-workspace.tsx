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
	optionApps,
	onSubmit,
	...props
}: BoxProps & {
	optionApps: Record<
		KarsaApp['category'],
		(ComboboxItem & { description: KarsaApp['description'] })[]
	>;
	onSubmit: (values: PayloadWindowWorkspace) => void;
}) {
	const form = useForm<PayloadWindowWorkspace>({
		validate: schemaResolver(PayloadWindowWorkspaceSchema, { sync: true }),
	});

	useEffect(() => {
		if (!form.values.id) {
			form.setFieldValue('id', crypto.randomUUID());
		}
	}, [form.values.id]);

	return (
		<Box
			{...props}
			component="form"
			data-slot="FormWindowWorkspace"
			onSubmit={form.onSubmit(onSubmit)}
		>
			<Stack gap={6}>
				<TextInput
					label="Title"
					size="sm"
					labelProps={{
						fz: 'xs',
					}}
					key={form.key('title')}
					{...form.getInputProps('title')}
				/>
				<Select
					label="Choose App"
					size="sm"
					labelProps={{
						fz: 'xs',
					}}
					data={Object.entries(optionApps).map(([group, items]) => ({
						group: labelAppCategory[group as KarsaApp['category']],
						items,
					}))}
					key={form.key('app')}
					{...form.getInputProps('app')}
				/>
				<Button
					type="submit"
					size="md"
					fz="sm"
					mt={6}
					// disabled={!form.isValid() || Object.keys(form.errors).length > 0}
				>
					Create Window
				</Button>
			</Stack>
		</Box>
	);
}
