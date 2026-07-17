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
import { optionsKarsaFrasePreference, optionsLanguageApp } from '~app-modules/enum-options';
import {
	PayloadKarsaParafraseSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaParafrase,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

export default function FormKarsaParafrase({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaParafrase;
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
		const payload = PayloadKarsaParafraseSchema.safeParse(data).data;

		return {
			sourceLanguage: payload?.sourceLanguage || 'indonesia',
			targetLanguage: payload?.sourceLanguage || 'indonesia',
			preference: payload?.preference || '',
			text: payload?.text || '',
		} satisfies PayloadKarsaParafrase;
	}, [data]);

	const form = useForm<PayloadKarsaParafrase>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaParafraseSchema, { sync: true }),
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
			data-slot="FormKarsaParafrase"
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
						app: 'parafrase',
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
						label="Source Language"
						name="sourceLanguage"
						key={form.key('sourceLanguage')}
						readOnly={isLoading}
						maxDropdownHeight={160}
						data={optionsLanguageApp}
						{...form.getInputProps('sourceLanguage')}
					/>
					<Select
						label="Target Language"
						name="targetLanguage"
						key={form.key('targetLanguage')}
						readOnly={isLoading}
						maxDropdownHeight={160}
						data={optionsLanguageApp}
						{...form.getInputProps('targetLanguage')}
					/>
					<Autocomplete
						label="Preference"
						name="preference"
						key={form.key('preference')}
						readOnly={isLoading}
						maxDropdownHeight={160}
						data={optionsKarsaFrasePreference}
						{...form.getInputProps('preference')}
					/>
					<Textarea
						label="Text"
						name="text"
						key={form.key('text')}
						readOnly={isLoading}
						{...form.getInputProps('text')}
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
