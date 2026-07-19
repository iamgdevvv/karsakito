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
	optionsKarsaFrasePreference,
	optionsLanguageApp,
} from '~app-modules/enum-options';
import {
	karasInputMaxLength,
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
						label="Bahasa sumber"
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
										Menentukan bahasa asli agar AI memahami makna dan struktur
										teks sebelum memparafrasekannya.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="sourceLanguage"
						placeholder="Pilih bahasa sumber"
						key={form.key('sourceLanguage')}
						readOnly={isLoading}
						maxDropdownHeight={160}
						data={optionsLanguageApp}
						{...form.getInputProps('sourceLanguage')}
					/>
					<Select
						label="Bahasa tujuan"
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
										Menentukan bahasa hasil; dapat sama dengan bahasa sumber
										atau sekaligus mengalihbahasakan parafrasa.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="targetLanguage"
						placeholder="Pilih bahasa tujuan"
						key={form.key('targetLanguage')}
						readOnly={isLoading}
						maxDropdownHeight={160}
						data={optionsLanguageApp}
						{...form.getInputProps('targetLanguage')}
					/>
					<Autocomplete
						label="Preferensi"
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
										Mengatur cara teks ditulis ulang, seperti tingkat
										formalitas, kesederhanaan, atau kedekatan dengan teks asli.
										Jika opsi yang tersedia belum sesuai, Anda dapat memasukkan
										pilihan lain sesuai kebutuhan.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="preference"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('preference')}
						readOnly={isLoading}
						placeholder="Pilih atau tulis gaya hasil"
						maxDropdownHeight={160}
						data={optionsKarsaFrasePreference}
						{...form.getInputProps('preference')}
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
										Isi yang akan ditulis ulang dengan susunan berbeda sambil
										mempertahankan makna utamanya.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="text"
						maxLength={karasInputMaxLength.text}
						required
						key={form.key('text')}
						readOnly={isLoading}
						placeholder="Tempel teks yang ingin diparafrasekan."
						{...form.getInputProps('text')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Buat {labelAppName.parafrase}
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
