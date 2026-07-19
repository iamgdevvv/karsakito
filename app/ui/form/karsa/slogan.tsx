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
import {
	labelAppName,
	optionsKarsaWriterAudience,
	optionsLanguageApp,
} from '~app-modules/enum-options';
import {
	karasInputMaxLength,
	PayloadKarsaSloganSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaSlogan,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

export default function FormKarsaSlogan({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaSlogan;
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
		const payload = PayloadKarsaSloganSchema.safeParse(data).data;

		return {
			language: payload?.language || 'indonesia',
			campaign: payload?.campaign || '',
			audience: payload?.audience || '',
			tone: payload?.tone || '',
			wordLength: payload?.wordLength ?? 6,
		} satisfies PayloadKarsaSlogan;
	}, [data]);

	const form = useForm<PayloadKarsaSlogan>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaSloganSchema, { sync: true }),
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
			data-slot="FormKarsaSlogan"
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
						app: 'slogan',
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
						label="Kampanye"
						name="campaign"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('campaign')}
						readOnly={isLoading}
						placeholder="Contoh: Gerakan Kurangi Sampah Plastik"
						{...form.getInputProps('campaign')}
					/>
					<Autocomplete
						label="Audiens"
						name="audience"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('audience')}
						readOnly={isLoading}
						placeholder="Pilih atau tulis audiens"
						maxDropdownHeight={160}
						data={optionsKarsaWriterAudience}
						{...form.getInputProps('audience')}
					/>
					<Autocomplete
						label="Gaya"
						name="tone"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('tone')}
						readOnly={isLoading}
						placeholder="Pilih atau tulis gaya slogan"
						maxDropdownHeight={160}
						data={[
							'Tegas',
							'Instruktif',
							'Persuasif',
							'Ramah',
							'Berima',
							'Emosional',
							'Spiritual',
						]}
						{...form.getInputProps('tone')}
					/>
					<NumberInput
						label="Jumlah kata"
						name="wordLength"
						required
						max={20}
						key={form.key('wordLength')}
						readOnly={isLoading}
						placeholder="Contoh: 5"
						leftSection={<PiTextColumns size={18} />}
						{...form.getInputProps('wordLength')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Buat {labelAppName.slogan}
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
