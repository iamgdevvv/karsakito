import {
	Alert,
	Autocomplete,
	Box,
	Button,
	Group,
	HoverCard,
	Select,
	Stack,
	Text,
	Textarea,
	type BoxProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import { useFetcher } from 'react-router';
import {
	labelAppName,
	optionsKarsaLisaAudience,
	optionsLanguageApp,
} from '~app-modules/enum-options';
import {
	karasInputMaxLength,
	PayloadKarsaAnalisaKalimatSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaAnalisaKalimat,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

export default function FormKarsaAnalisaKalimat({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaAnalisaKalimat;
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
		const payload = PayloadKarsaAnalisaKalimatSchema.safeParse(data).data;

		return {
			language: payload?.language || 'indonesia',
			audience: payload?.audience || '',
			text: payload?.text || '',
		} satisfies PayloadKarsaAnalisaKalimat;
	}, [data]);

	const form = useForm<PayloadKarsaAnalisaKalimat>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaAnalisaKalimatSchema, { sync: true }),
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
			data-slot="FormKarsaAnalisaKalimat"
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
						app: 'analisakalimat',
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
						description={
							<HoverCard
								width={240}
								position="bottom-start"
								offset={4}
								shadow="md"
							>
								<HoverCard.Target>
									<Text
										span
										fz="xs"
									>
										Butuh penjelasan? Lihat informasi field{' '}
										<Text
											span
											inherit
											fw={600}
											td="underline"
										>
											disini
										</Text>
										.
									</Text>
								</HoverCard.Target>
								<HoverCard.Dropdown>
									<Text
										span
										c="black"
										fz="xs"
									>
										Menentukan bahasa yang digunakan AI untuk menyampaikan hasil
										analisis kalimat.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
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
						label="Audiens"
						description={
							<HoverCard
								width={240}
								position="bottom-start"
								offset={4}
								shadow="md"
							>
								<HoverCard.Target>
									<Text
										span
										fz="xs"
									>
										Butuh penjelasan? Lihat informasi field{' '}
										<Text
											span
											inherit
											fw={600}
											td="underline"
										>
											disini
										</Text>
										.
									</Text>
								</HoverCard.Target>
								<HoverCard.Dropdown>
									<Text
										span
										c="black"
										fz="xs"
									>
										Menyesuaikan istilah, kedalaman, dan cara penjelasan agar
										mudah dipahami pembaca sasaran. Jika opsi yang tersedia
										belum sesuai, Anda dapat memasukkan pilihan lain sesuai
										kebutuhan.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="audience"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('audience')}
						readOnly={isLoading}
						placeholder="Pilih atau tulis audiens"
						data={optionsKarsaLisaAudience}
						{...form.getInputProps('audience')}
					/>
					<Textarea
						label="Teks"
						description={
							<HoverCard
								width={240}
								position="bottom-start"
								offset={4}
								shadow="md"
							>
								<HoverCard.Target>
									<Text
										span
										fz="xs"
									>
										Butuh penjelasan? Lihat informasi field{' '}
										<Text
											span
											inherit
											fw={600}
											td="underline"
										>
											disini
										</Text>
										.
									</Text>
								</HoverCard.Target>
								<HoverCard.Dropdown>
									<Text
										span
										c="black"
										fz="xs"
									>
										Kalimat yang menjadi sumber seluruh temuan, penafsiran, dan
										penjelasan AI.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="text"
						maxLength={karasInputMaxLength.text}
						required
						key={form.key('text')}
						readOnly={isLoading}
						placeholder="Tempel kalimat yang ingin dianalisis."
						{...form.getInputProps('text')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Buat {labelAppName.analisakalimat}
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
