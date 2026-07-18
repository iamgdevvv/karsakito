import {
	Alert,
	Autocomplete,
	Box,
	Button,
	Group,
	NumberInput,
	Select,
	Stack,
	Textarea,
	TextInput,
	type BoxProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import { PiTextColumns } from 'react-icons/pi';
import { useFetcher } from 'react-router';
import { optionsKarsaWriterAudience, optionsLanguageApp } from '~app-modules/enum-options';
import {
	PayloadKarsaPidatoSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaPidato,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

export default function FormKarsaPidato({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaPidato;
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
		const payload = PayloadKarsaPidatoSchema.safeParse(data).data;

		return {
			language: payload?.language || 'indonesia',
			purpose: payload?.purpose || '',
			agenda: payload?.agenda || '',
			speaker: payload?.speaker || '',
			audience: payload?.audience || '',
			topic: payload?.topic || '',
			totalSentence: payload?.totalSentence ?? 28,
		} satisfies PayloadKarsaPidato;
	}, [data]);

	const form = useForm<PayloadKarsaPidato>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaPidatoSchema, { sync: true }),
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
			data-slot="FormKarsaPidato"
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
						app: 'pidato',
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
					<Autocomplete
						label="Tujuan"
						name="purpose"
						required
						key={form.key('purpose')}
						readOnly={isLoading}
						placeholder="Pilih atau tulis tujuan pidato"
						maxDropdownHeight={160}
						data={[
							'Sambutan',
							'Pembukaan',
							'Peresmian',
							'Penutup',
							'Ceramah',
							'Orasi',
							'Peringatan',
							'Pertanggungjawaban',
							'Berita Duka',
							'Informatif',
							'Persuasif',
							'Rekreatif',
							'Argumentatif',
							'Deskriptif',
						]}
						{...form.getInputProps('purpose')}
					/>
					<TextInput
						label="Acara"
						name="agenda"
						required
						key={form.key('agenda')}
						readOnly={isLoading}
						placeholder="Contoh: pembukaan rapat kerja"
						{...form.getInputProps('agenda')}
					/>
					<TextInput
						label="Pembicara"
						name="speaker"
						required
						key={form.key('speaker')}
						readOnly={isLoading}
						placeholder="Contoh: Ketua Panitia"
						{...form.getInputProps('speaker')}
					/>
					<Autocomplete
						label="Audiens"
						name="audience"
						required
						key={form.key('audience')}
						readOnly={isLoading}
						placeholder="Pilih atau tulis audiens"
						maxDropdownHeight={160}
						data={optionsKarsaWriterAudience}
						{...form.getInputProps('audience')}
					/>
					<Textarea
						label="Topik"
						name="topic"
						required
						key={form.key('topic')}
						readOnly={isLoading}
						placeholder="Contoh: kolaborasi untuk kemajuan daerah"
						{...form.getInputProps('topic')}
					/>
					<NumberInput
						label="Jumlah kalimat"
						name="totalSentence"
						required
						max={80}
						key={form.key('totalSentence')}
						readOnly={isLoading}
						placeholder="Contoh: 12"
						leftSection={<PiTextColumns size={18} />}
						{...form.getInputProps('totalSentence')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Buat pidato
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
