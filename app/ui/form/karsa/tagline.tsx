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
import { optionsKarsaWriterAudience, optionsLanguageApp } from '~app-modules/enum-options';
import {
	PayloadKarsaTaglineSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaTagline,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

export default function FormKarsaTagline({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaTagline;
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
		const payload = PayloadKarsaTaglineSchema.safeParse(data).data;

		return {
			language: payload?.language || 'indonesia',
			entity: payload?.entity || '',
			usp: payload?.usp || '',
			audience: payload?.audience || '',
			tone: payload?.tone || '',
			wordLength: payload?.wordLength ?? 8,
		} satisfies PayloadKarsaTagline;
	}, [data]);

	const form = useForm<PayloadKarsaTagline>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaTaglineSchema, { sync: true }),
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
			data-slot="FormKarsaTagline"
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
						app: 'tagline',
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
						required
						key={form.key('entity')}
						readOnly={isLoading}
						placeholder="Contoh: KarsaKito"
						{...form.getInputProps('entity')}
					/>
					<TextInput
						label="Keunggulan utama"
						name="usp"
						required
						key={form.key('usp')}
						readOnly={isLoading}
						placeholder="Contoh: tool AI berbahasa Indonesia yang praktis"
						{...form.getInputProps('usp')}
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
					<Autocomplete
						label="Gaya"
						name="tone"
						required
						key={form.key('tone')}
						readOnly={isLoading}
						placeholder="Pilih atau tulis gaya tagline"
						maxDropdownHeight={160}
						data={[
							'Unik',
							'Mudah Diingat',
							'Semangat',
							'Menggebu',
							'Ramah',
							'Klasik',
							'Mengayomi',
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
							Buat tagline
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
