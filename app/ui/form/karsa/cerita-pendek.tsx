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
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaCeritaPendek;
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
			totalParagraph: payload?.totalParagraph ?? 16,
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
					<Autocomplete
						label="Genre"
						name="genre"
						key={form.key('genre')}
						readOnly={isLoading}
						maxDropdownHeight={80}
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
						label="Audience"
						name="audience"
						key={form.key('audience')}
						readOnly={isLoading}
						maxDropdownHeight={80}
						data={optionsKarsaWriterAudience}
						{...form.getInputProps('audience')}
					/>
					<TextInput
						label="Morale"
						name="morale"
						key={form.key('morale')}
						readOnly={isLoading}
						{...form.getInputProps('morale')}
					/>
					<Textarea
						label="Topic"
						name="topic"
						key={form.key('topic')}
						readOnly={isLoading}
						{...form.getInputProps('topic')}
					/>
					<NumberInput
						label="Jumlah Kata"
						name="totalParagraph"
						max={28}
						key={form.key('totalParagraph')}
						readOnly={isLoading}
						leftSection={<PiTextColumns size={18} />}
						{...form.getInputProps('totalParagraph')}
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
