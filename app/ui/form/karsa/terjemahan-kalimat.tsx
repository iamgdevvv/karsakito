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
import { optionsLanguageApp } from '~app-modules/enum-options';
import {
	PayloadKarsaTerjemahanKalimatSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaTerjemahanKalimat,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

export default function FormKarsaTerjemahanKalimat({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaTerjemahanKalimat;
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
		const payload = PayloadKarsaTerjemahanKalimatSchema.safeParse(data).data;

		return {
			sourceLanguage: payload?.sourceLanguage || 'indonesia',
			targetLanguage: payload?.sourceLanguage || 'minang',
			usage: payload?.usage || '',
			text: payload?.text || '',
		} satisfies PayloadKarsaTerjemahanKalimat;
	}, [data]);

	const form = useForm<PayloadKarsaTerjemahanKalimat>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaTerjemahanKalimatSchema, { sync: true }),
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
			data-slot="FormKarsaTerjemahanKalimat"
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
						app: 'terjemahankalimat',
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
						maxDropdownHeight={80}
						data={optionsLanguageApp.filter(
							(item) => item.value !== form.values.targetLanguage,
						)}
						{...form.getInputProps('sourceLanguage')}
					/>
					<Select
						label="Target Language"
						name="targetLanguage"
						key={form.key('targetLanguage')}
						readOnly={isLoading}
						maxDropdownHeight={80}
						data={optionsLanguageApp.filter(
							(item) => item.value !== form.values.sourceLanguage,
						)}
						{...form.getInputProps('targetLanguage')}
					/>
					<Autocomplete
						label="Usage"
						name="usage"
						key={form.key('usage')}
						readOnly={isLoading}
						data={[
							'Percakapan Non-Formal',
							'Percakapan Formal',
							'Surat Resmi',
							'Surat Pribadi',
						]}
						{...form.getInputProps('usage')}
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
