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
import {
	labelAppName,
	optionsKarsaWriterAudience,
	optionsLanguageApp,
} from '~app-modules/enum-options';
import {
	karasInputMaxLength,
	PayloadKarsaCeritaPendekSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaCeritaPendek,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

export default function FormKarsaCeritaPendek({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaCeritaPendek;
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
		const payload = PayloadKarsaCeritaPendekSchema.safeParse(data).data;

		return {
			language: payload?.language || 'indonesia',
			genre: payload?.genre || '',
			audience: payload?.audience || '',
			morale: payload?.morale || '',
			topic: payload?.topic || '',
			totalParagraphs: payload?.totalParagraphs ?? 16,
		} satisfies PayloadKarsaCeritaPendek;
	}, [data]);

	const form = useForm<PayloadKarsaCeritaPendek>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaCeritaPendekSchema, { sync: true }),
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
			data-slot="FormKarsaCeritaPendek"
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
						app: 'ceritapendek',
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
						label="Genre"
						name="genre"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('genre')}
						readOnly={isLoading}
						placeholder="Pilih atau tulis genre cerita"
						maxDropdownHeight={160}
						data={[
							'Fabel (Cerita Binatang)',
							'Dongeng',
							'Legenda',
							'Mitos',
							'Kehidupan Sehari-hari (Realita)',
							'Sage',
							'Komedi / Jenaka',
							'Horor / Misteri / Gaib',
						]}
						{...form.getInputProps('genre')}
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
					<TextInput
						label="Pesan moral"
						name="morale"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('morale')}
						readOnly={isLoading}
						placeholder="Contoh: pentingnya menjaga kejujuran"
						{...form.getInputProps('morale')}
					/>
					<Textarea
						label="Topik"
						name="topic"
						maxLength={karasInputMaxLength.prompt}
						required
						key={form.key('topic')}
						readOnly={isLoading}
						placeholder="Contoh: persahabatan dua sahabat di sekolah"
						{...form.getInputProps('topic')}
					/>
					<NumberInput
						label="Jumlah paragraf"
						name="totalParagraphs"
						required
						max={28}
						key={form.key('totalParagraphs')}
						readOnly={isLoading}
						placeholder="Contoh: 5"
						leftSection={<PiTextColumns size={18} />}
						{...form.getInputProps('totalParagraphs')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Buat {labelAppName.ceritapendek}
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
