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
	type BoxProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import { PiTextColumns } from 'react-icons/pi';
import { useFetcher } from 'react-router';
import { optionsKarsaWriterAudience, optionsLanguageApp } from '~app-modules/enum-options';
import {
	PayloadKarsaPantunSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaPantun,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

const optionsKarsaPantunType = [
	'Nasihat',
	'Jenaka',
	'Cinta',
	'Persahabatan',
	'Petuah',
	'Pendidikan',
	'Agama',
	'Budaya',
	'Adat',
	'Penyambutan',
	'Perpisahan',
	'Ucapan Selamat',
	'Terima Kasih',
	'Permintaan Maaf',
	'Sindiran',
	'Kritik',
	'Teka-Teki',
	'Anak-anak',
	'Lingkungan',
	'Kebangsaan',
];

export default function FormKarsaPantun({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaPantun;
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
		const payload = PayloadKarsaPantunSchema.safeParse(data).data;

		return {
			language: payload?.language || 'indonesia',
			type: payload?.type || 'Nasihat',
			audience: payload?.audience || '',
			topic: payload?.topic || '',
			numberVerses: payload?.numberVerses ?? 2,
		} satisfies PayloadKarsaPantun;
	}, [data]);

	const form = useForm<PayloadKarsaPantun>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaPantunSchema, { sync: true }),
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
			data-slot="FormKarsaPantun"
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
						app: 'pantun',
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
						label="Language"
						name="language"
						key={form.key('language')}
						readOnly={isLoading}
						maxDropdownHeight={160}
						data={optionsLanguageApp}
						{...form.getInputProps('language')}
					/>
					<Select
						label="Type"
						name="type"
						key={form.key('type')}
						readOnly={isLoading}
						maxDropdownHeight={160}
						data={optionsKarsaPantunType}
						placeholder="Pilih jenis pantun"
						{...form.getInputProps('type')}
					/>
					<Autocomplete
						label="Audience"
						name="audience"
						key={form.key('audience')}
						readOnly={isLoading}
						maxDropdownHeight={160}
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
						label="Number Verses"
						name="numberVerses"
						max={20}
						key={form.key('numberVerses')}
						readOnly={isLoading}
						leftSection={<PiTextColumns size={18} />}
						{...form.getInputProps('numberVerses')}
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
