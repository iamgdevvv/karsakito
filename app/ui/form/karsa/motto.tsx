import {
	Alert,
	Autocomplete,
	Box,
	Button,
	Group,
	NumberInput,
	Select,
	Stack,
	TextInput,
	type BoxProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import { PiTextColumns } from 'react-icons/pi';
import { useFetcher } from 'react-router';
import { labelAppName, optionsLanguageApp } from '~app-modules/enum-options';
import {
	karasInputMaxLength,
	PayloadKarsaMottoSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaMotto,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

export default function FormKarsaMotto({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaMotto;
	onError: (message: string) => void;
	onSubmitProgress: () => void;
	onSubmit: (values: NonNullable<PayloadWindowWorkspace['karsa']>) => void;
}) {
	const fetcher = useFetcher<ActionSubmissionKarsaAI>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isLoading = useMemo(() => {
		return fetcher.state !== 'idle';
	}, [fetcher.state]);

	const initialValues = useMemo(() => {
		const payload = PayloadKarsaMottoSchema.safeParse(data).data;

		return {
			language: payload?.language || 'indonesia',
			entity: payload?.entity || '',
			core_value: payload?.core_value || '',
			tone: payload?.tone || '',
			wordLength: payload?.wordLength ?? 6,
		} satisfies PayloadKarsaMotto;
	}, [data]);

	const form = useForm<PayloadKarsaMotto>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaMottoSchema, { sync: true }),
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
		if (!isLoading && fetcher.data) {
			if ('error' in fetcher.data) {
				onError(fetcher.data.error);
				setErrorMessage(fetcher.data.error);
			} else {
				onSubmit(fetcher.data.data);
			}
		}
	}, [fetcher.data, isLoading]);

	return (
		<Box
			{...props}
			data-slot="FormKarsaMotto"
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
				action="/submission/karsa"
				onSubmit={form.onSubmit((values, e) => {
					e?.preventDefault();
					setErrorMessage(null);
					onSubmitProgress();
					const payload = PayloadSubmissionKarsaSchema.safeParse({
						app: 'motto',
						payload: values,
					} satisfies PayloadSubmissionKarsa);

					if (payload.data) {
						fetcher.submit(
							{
								body: JSON.stringify(payload.data),
							},
							{
								method: 'post',
								action: '/submission/karsa',
							},
						);
					} else {
						onError(payload.error.message);
						setErrorMessage(payload.error.message);
					}
				})}
			>
				<Stack gap="xs">
					<Select
						label="Pilih Bahasa"
						required
						name="language"
						placeholder="Pilih bahasa"
						key={form.key('language')}
						readOnly={isLoading}
						maxDropdownHeight={160}
						data={optionsLanguageApp}
						{...form.getInputProps('language')}
					/>
					<TextInput
						label="Nama entitas"
						name="entity"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('entity')}
						readOnly={isLoading}
						placeholder="Contoh: KarsaKito"
						{...form.getInputProps('entity')}
					/>
					<TextInput
						label="Nilai utama"
						name="core_value"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('core_value')}
						readOnly={isLoading}
						placeholder="Contoh: kolaborasi dan integritas"
						{...form.getInputProps('core_value')}
					/>
					<Autocomplete
						label="Gaya"
						name="tone"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('tone')}
						readOnly={isLoading}
						placeholder="Pilih atau tulis gaya motto"
						maxDropdownHeight={160}
						data={['Klasik', 'Singkat', 'Kiasan']}
						{...form.getInputProps('tone')}
					/>
					<NumberInput
						label="Jumlah kata"
						name="wordLength"
						required
						max={20}
						key={form.key('wordLength')}
						readOnly={isLoading}
						placeholder="Contoh: 4"
						leftSection={<PiTextColumns size={18} />}
						{...form.getInputProps('wordLength')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Buat {labelAppName.motto}
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
