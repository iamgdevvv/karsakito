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
import { optionsLanguageApp } from '~app-modules/enum-options';
import {
	PayloadKarsaMottoSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaMotto,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

export default function FormKarsaMotto({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaMotto;
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
		const payload = PayloadKarsaMottoSchema.safeParse(data).data;

		return {
			language: payload?.language || 'indonesia',
			entity: payload?.entity || '',
			core_value: payload?.core_value || '',
			tone: payload?.tone || '',
			wordLength: payload?.wordLength ?? 6,
		} satisfies PayloadKarsaMotto;
	}, [data]);

	const form = useForm<PayloadKarsaMotto>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaMottoSchema, { sync: true }),
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
			data-slot="FormKarsaMotto"
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
						app: 'motto',
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
					<TextInput
						label="Entity"
						name="entity"
						key={form.key('entity')}
						readOnly={isLoading}
						{...form.getInputProps('entity')}
					/>
					<TextInput
						label="Core Value"
						name="core_value"
						key={form.key('core_value')}
						readOnly={isLoading}
						{...form.getInputProps('core_value')}
					/>
					<Autocomplete
						label="Tone"
						name="tone"
						key={form.key('tone')}
						readOnly={isLoading}
						maxDropdownHeight={80}
						data={['Klasik', 'Singkat', 'Kiasan']}
						{...form.getInputProps('tone')}
					/>
					<NumberInput
						label="Jumlah Kata"
						name="wordLength"
						max={20}
						key={form.key('wordLength')}
						readOnly={isLoading}
						leftSection={<PiTextColumns size={18} />}
						{...form.getInputProps('wordLength')}
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
