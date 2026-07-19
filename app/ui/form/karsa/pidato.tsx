import {
	Alert,
	Autocomplete,
	Box,
	Button,
	Group,
	HoverCard,
	NumberInput,
	Select,
	Stack,
	Text,
	Textarea,
	TextInput,
	type BoxProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import { PiTextColumns } from 'react-icons/pi';
import { useFetcher } from 'react-router';
import {
	labelAppName,
	optionsKarsaWriterAudience,
	optionsLanguageApp,
} from '~app-modules/enum-options';
import {
	karasInputMaxLength,
	PayloadKarsaPidatoSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaPidato,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

export default function FormKarsaPidato({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaPidato;
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
		const payload = PayloadKarsaPidatoSchema.safeParse(data).data;

		return {
			language: payload?.language || 'indonesia',
			purpose: payload?.purpose || '',
			agenda: payload?.agenda || '',
			speaker: payload?.speaker || '',
			audience: payload?.audience || '',
			topic: payload?.topic || '',
			totalSentence: payload?.totalSentence ?? 28,
		} satisfies PayloadKarsaPidato;
	}, [data]);

	const form = useForm<PayloadKarsaPidato>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaPidatoSchema, { sync: true }),
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
			data-slot="FormKarsaPidato"
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
						app: 'pidato',
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
										Menentukan bahasa yang digunakan pada seluruh naskah pidato.
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
						label="Tujuan"
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
										Mengarahkan strategi penyampaian pidato, misalnya untuk
										menginformasikan, mengajak, atau menginspirasi. Jika opsi
										yang tersedia belum sesuai, Anda dapat memasukkan pilihan
										lain sesuai kebutuhan.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="purpose"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('purpose')}
						readOnly={isLoading}
						placeholder="Pilih atau tulis tujuan pidato"
						maxDropdownHeight={160}
						data={[
							'Sambutan',
							'Pembukaan',
							'Peresmian',
							'Penutup',
							'Ceramah',
							'Orasi',
							'Peringatan',
							'Pertanggungjawaban',
							'Berita Duka',
							'Informatif',
							'Persuasif',
							'Rekreatif',
							'Argumentatif',
							'Deskriptif',
						]}
						{...form.getInputProps('purpose')}
					/>
					<TextInput
						label="Acara"
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
										Memberi konteks situasi agar pembukaan, sapaan, isi, dan
										penutup pidato sesuai dengan acaranya.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="agenda"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('agenda')}
						readOnly={isLoading}
						placeholder="Contoh: pembukaan rapat kerja"
						{...form.getInputProps('agenda')}
					/>
					<TextInput
						label="Pembicara"
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
										Menentukan identitas atau peran suara yang berbicara
										sehingga sudut pandang dan kewenangannya terasa tepat.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="speaker"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('speaker')}
						readOnly={isLoading}
						placeholder="Contoh: Ketua Panitia"
						{...form.getInputProps('speaker')}
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
										Menyesuaikan sapaan, istilah, argumen, dan tingkat
										formalitas kepada pendengar sasaran. Jika opsi yang tersedia
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
						maxDropdownHeight={160}
						data={optionsKarsaWriterAudience}
						{...form.getInputProps('audience')}
					/>
					<Textarea
						label="Topik"
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
										Menentukan pokok bahasan, gagasan pendukung, dan pesan utama
										naskah pidato.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="topic"
						maxLength={karasInputMaxLength.prompt}
						required
						key={form.key('topic')}
						readOnly={isLoading}
						placeholder="Contoh: kolaborasi untuk kemajuan daerah"
						{...form.getInputProps('topic')}
					/>
					<NumberInput
						label="Jumlah kalimat"
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
										Menentukan target panjang dan tingkat perincian naskah
										pidato yang dihasilkan.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="totalSentence"
						required
						max={80}
						key={form.key('totalSentence')}
						readOnly={isLoading}
						placeholder="Contoh: 12"
						leftSection={<PiTextColumns size={18} />}
						{...form.getInputProps('totalSentence')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Buat {labelAppName.pidato}
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
