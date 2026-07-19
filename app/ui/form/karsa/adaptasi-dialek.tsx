import {
	Alert,
	Box,
	Button,
	Group,
	HoverCard,
	Select,
	Stack,
	Text,
	Textarea,
	TextInput,
	type BoxProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import { useFetcher } from 'react-router';
import { labelAppName, optionsLanguageApp } from '~app-modules/enum-options';
import {
	karasInputMaxLength,
	PayloadKarsaAdaptasiDialekSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaAdaptasiDialek,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

export default function FormKarsaAdaptasiDialek({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaAdaptasiDialek;
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
		const payload = PayloadKarsaAdaptasiDialekSchema.safeParse(data).data;

		return {
			sourceLanguage: payload?.sourceLanguage || 'indonesia',
			targetLanguage: payload?.sourceLanguage || 'indonesia',
			dialect: payload?.dialect || '',
			text: payload?.text || '',
		} satisfies PayloadKarsaAdaptasiDialek;
	}, [data]);

	const form = useForm<PayloadKarsaAdaptasiDialek>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaAdaptasiDialekSchema, { sync: true }),
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
			data-slot="FormKarsaAdaptasiDialek"
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
						app: 'adaptasidialek',
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
										Menentukan bahasa asli teks agar AI memahami kosakata dan
										makna awal sebelum mengadaptasinya.
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
										Menentukan bahasa keluaran yang digunakan AI saat menulis
										hasil adaptasi dialek.
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
					<TextInput
						label="Dialek"
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
										Mengarahkan pilihan kosakata, ungkapan, dan nuansa lokal
										yang diterapkan pada hasil.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="dialect"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('dialect')}
						readOnly={isLoading}
						placeholder="Contoh: dialek Minang Bukittinggi"
						{...form.getInputProps('dialect')}
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
										Isi utama yang akan dipertahankan maknanya lalu ditulis
										ulang sesuai bahasa dan dialek pilihan.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="text"
						maxLength={karasInputMaxLength.text}
						required
						key={form.key('text')}
						readOnly={isLoading}
						placeholder="Tulis teks yang ingin diadaptasi."
						{...form.getInputProps('text')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Buat {labelAppName.adaptasidialek}
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
