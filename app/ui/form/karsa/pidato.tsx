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
					title="Error"
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
						label="Language"
						name="language"
						key={form.key('language')}
						readOnly={isLoading}
						maxDropdownHeight={80}
						data={optionsLanguageApp}
						{...form.getInputProps('language')}
					/>
					<Autocomplete
						label="Purpose"
						name="purpose"
						key={form.key('purpose')}
						readOnly={isLoading}
						maxDropdownHeight={80}
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
						label="Agenda"
						name="agenda"
						key={form.key('agenda')}
						readOnly={isLoading}
						{...form.getInputProps('agenda')}
					/>
					<TextInput
						label="Speaker"
						name="speaker"
						key={form.key('speaker')}
						readOnly={isLoading}
						{...form.getInputProps('speaker')}
					/>
					<Autocomplete
						label="Audience"
						name="audience"
						key={form.key('audience')}
						readOnly={isLoading}
						maxDropdownHeight={80}
						data={optionsKarsaWriterAudience}
						{...form.getInputProps('audience')}
					/>
					<Textarea
						label="Topic"
						name="topic"
						key={form.key('topic')}
						readOnly={isLoading}
						{...form.getInputProps('topic')}
					/>
					<NumberInput
						label="Total Sentence"
						name="totalSentence"
						max={80}
						key={form.key('totalSentence')}
						readOnly={isLoading}
						leftSection={<PiTextColumns size={18} />}
						{...form.getInputProps('totalSentence')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Submit App
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
