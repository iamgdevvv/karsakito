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
import { slugify } from '~app-modules/utils';
import type { KarsaApp } from '~generated/prisma/browser';

export default function FormWindowWorkspace({
	optionApps,
	usedTitles,
	onSubmit,
	...props
}: BoxProps & {
	optionApps: Record<KarsaApp['category'], ComboboxItem[]>;
	usedTitles: string[];
	onSubmit: (values: PayloadWindowWorkspace) => void;
}) {
	const form = useForm<PayloadWindowWorkspace>({
		validate: schemaResolver(PayloadWindowWorkspaceSchema, { sync: true }),
	});

	useEffect(() => {
		if (form.values.title) {
			usedTitles.forEach((title) => {
				if (title === form.values.title || slugify(title) === slugify(form.values.title)) {
					form.setFieldError('title', 'Title already in use');
				}
			});
		}
	}, [form.values.title]);

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
					disabled={!form.isValid() || Object.keys(form.errors).length > 0}
				>
					Create Window
				</Button>
			</Stack>
		</Box>
	);
}
