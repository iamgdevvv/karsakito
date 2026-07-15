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
import { optionsLanguageApp } from '~app-modules/enum-options';
import {
	PayloadKarsaDoaBersamaSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaDoaBersama,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

export default function FormKarsaDoaBersama({
	data,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaDoaBersama;
	onSubmitProgress: () => void;
	onSubmit: (values: NonNullable<PayloadWindowWorkspace['karsa']>) => void;
}) {
	const fetcher = useFetcher<ActionSubmissionKarsaAI>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isLoading = useMemo(() => {
		return fetcher.state !== 'idle';
	}, [fetcher.state]);

	const initialValues = useMemo(() => {
		const payload = PayloadKarsaDoaBersamaSchema.safeParse(data).data;

		return {
			language: payload?.language || 'indonesia',
			religion: payload?.religion || '',
			topic: payload?.topic || '',
			totalSentence: payload?.totalSentence ?? 16,
		} satisfies PayloadKarsaDoaBersama;
	}, [data]);

	const form = useForm<PayloadKarsaDoaBersama>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaDoaBersamaSchema, { sync: true }),
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
			data-slot="FormKarsaDoaBersama"
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
						app: 'doabersama',
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
						label="Religion"
						name="religion"
						key={form.key('religion')}
						readOnly={isLoading}
						maxDropdownHeight={80}
						data={['Umum', 'Islam', 'Kristen', 'Katolik', 'Budha', 'Hindu', 'Konghucu']}
						{...form.getInputProps('religion')}
					/>
					<Textarea
						label="Topic"
						name="topic"
						key={form.key('topic')}
						readOnly={isLoading}
						{...form.getInputProps('topic')}
					/>
					<NumberInput
						label="Jumlah Kalimat"
						name="totalSentence"
						max={28}
						key={form.key('totalSentence')}
						readOnly={isLoading}
						leftSection={<PiTextColumns size={18} />}
						{...form.getInputProps('totalSentence')}
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
