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
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaTagline;
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
							},
						);
					} else {
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
						label="USP"
						name="usp"
						key={form.key('usp')}
						readOnly={isLoading}
						{...form.getInputProps('usp')}
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
					<Autocomplete
						label="Tone"
						name="tone"
						key={form.key('tone')}
						readOnly={isLoading}
						maxDropdownHeight={80}
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
