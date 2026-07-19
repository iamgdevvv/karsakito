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
	PayloadKarsaTerjemahanDokumenSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaTerjemahanDokumen,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

export default function FormKarsaTerjemahanDokumen({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaTerjemahanDokumen;
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
		const payload = PayloadKarsaTerjemahanDokumenSchema.safeParse(data).data;

		return {
			sourceLanguage: payload?.sourceLanguage || 'indonesia',
			targetLanguage: payload?.sourceLanguage || 'minang',
			info: payload?.info || '',
			selectionText: payload?.selectionText || '',
		} satisfies PayloadKarsaTerjemahanDokumen;
	}, [data]);

	const form = useForm<PayloadKarsaTerjemahanDokumen>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaTerjemahanDokumenSchema, { sync: true }),
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
			data-slot="FormKarsaTerjemahanDokumen"
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
						app: 'terjemahandokumen',
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
										Menentukan bahasa asli agar AI menafsirkan istilah dan
										konteks dokumen dengan tepat.
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
										Menentukan bahasa yang digunakan pada seluruh hasil
										terjemahan.
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
						label="Keterangan"
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
										Memberi konteks penggunaan dokumen agar istilah dan ragam
										bahasa terjemahan lebih sesuai.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="info"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('info')}
						readOnly={isLoading}
						placeholder="Contoh: pengumuman untuk warga"
						{...form.getInputProps('info')}
					/>
					<Textarea
						label="Teks terpilih"
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
										Bagian dokumen yang diterjemahkan; isi dan maknanya menjadi
										acuan utama hasil AI.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="selectionText"
						maxLength={karasInputMaxLength.text}
						required
						key={form.key('selectionText')}
						readOnly={true}
						placeholder="Pilih teks dari dokumen untuk diterjemahkan."
						{...form.getInputProps('selectionText')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Buat {labelAppName.terjemahandokumen}
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
