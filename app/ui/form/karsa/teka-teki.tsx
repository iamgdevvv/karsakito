import {
	Alert,
	Autocomplete,
	Box,
	Button,
	Group,
	Select,
	Stack,
	Textarea,
	type BoxProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import { useFetcher } from 'react-router';
import { labelAppName, optionsLanguageApp } from '~app-modules/enum-options';
import {
	karasInputMaxLength,
	PayloadKarsaTekaTekiSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaTekaTeki,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

export default function FormKarsaTekaTeki({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaTekaTeki;
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
		const payload = PayloadKarsaTekaTekiSchema.safeParse(data).data;

		return {
			language: payload?.language || 'indonesia',
			type: payload?.type || '',
			level: payload?.level || '',
			topic: payload?.topic || '',
		} satisfies PayloadKarsaTekaTeki;
	}, [data]);

	const form = useForm<PayloadKarsaTekaTeki>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaTekaTekiSchema, { sync: true }),
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
			data-slot="FormKarsaTekaTeki"
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
						app: 'tekateki',
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
						label="Jenis"
						name="type"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('type')}
						readOnly={isLoading}
						placeholder="Pilih atau tulis jenis teka-teki"
						maxDropdownHeight={160}
						data={[
							'Deskripsi Benda',
							'Deskripsi Hewan',
							'Deskripsi Tokoh',
							'Pelesetan',
							'Permainan Kata',
							'Berima',
							'Logika',
							'Matematika Sederhana',
						]}
						{...form.getInputProps('type')}
					/>
					<Autocomplete
						label="Tingkat kesulitan"
						name="level"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('level')}
						readOnly={isLoading}
						placeholder="Pilih atau tulis tingkat kesulitan"
						maxDropdownHeight={160}
						data={['Mudah', 'Sedang', 'Sulit']}
						{...form.getInputProps('level')}
					/>
					<Textarea
						label="Topik"
						name="topic"
						maxLength={karasInputMaxLength.prompt}
						required
						key={form.key('topic')}
						readOnly={isLoading}
						placeholder="Contoh: hewan laut untuk anak sekolah dasar"
						{...form.getInputProps('topic')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Buat {labelAppName.tekateki}
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
