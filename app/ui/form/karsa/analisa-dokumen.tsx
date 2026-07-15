import {
	Alert,
	Autocomplete,
	Box,
	Button,
	Group,
	Select,
	Stack,
	Textarea,
	TextInput,
	type BoxProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import { useFetcher } from 'react-router';
import { optionsKarsaLisaAudience, optionsLanguageApp } from '~app-modules/enum-options';
import {
	PayloadKarsaAnalisaDokumenSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaAnalisaDokumen,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

export default function FormKarsaAnalisaDokumen({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaAnalisaDokumen;
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
		const payload = PayloadKarsaAnalisaDokumenSchema.safeParse(data).data;

		return {
			language: payload?.language || 'indonesia',
			info: payload?.info || '',
			audience: payload?.audience || '',
			selectionText: payload?.selectionText || '',
		} satisfies PayloadKarsaAnalisaDokumen;
	}, [data]);

	const form = useForm<PayloadKarsaAnalisaDokumen>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaAnalisaDokumenSchema, { sync: true }),
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
			data-slot="FormKarsaAnalisaDokumen"
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
						app: 'analisadokumen',
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
						label="Audience"
						name="audience"
						key={form.key('audience')}
						readOnly={isLoading}
						data={optionsKarsaLisaAudience}
						{...form.getInputProps('audience')}
					/>
					<TextInput
						label="Info"
						name="info"
						key={form.key('info')}
						readOnly={isLoading}
						{...form.getInputProps('info')}
					/>
					<Textarea
						label="Text"
						name="selectionText"
						key={form.key('selectionText')}
						readOnly={true}
						{...form.getInputProps('selectionText')}
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
