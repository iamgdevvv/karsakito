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
	karsaNumericInputMax,
	PayloadKarsaSyairSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaSyair,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

const optionsKarsaSyairType = [
	'Nasihat',
	'Jenaka',
	'Cinta',
	'Persahabatan',
	'Petuah',
	'Pendidikan',
	'Agama',
	'Budaya',
	'Adat',
	'Penyambutan',
	'Perpisahan',
	'Ucapan Selamat',
	'Terima Kasih',
	'Permintaan Maaf',
	'Sindiran',
	'Kritik',
	'Teka-Teki',
	'Anak-anak',
	'Lingkungan',
	'Kepemimpinan',
	'Kebangsaan',
];

const optionsKarsaSyairTone = ['Klasik/Sastra Tinggi', 'Baku/Standar', 'Populer/Santai'];

export default function FormKarsaSyair({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaSyair;
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
		const payload = PayloadKarsaSyairSchema.safeParse(data).data;

		return {
			language: payload?.language || 'indonesia',
			type: payload?.type || 'Nasihat',
			audience: payload?.audience || '',
			tone: payload?.tone || 'Baku/Standar',
			topic: payload?.topic || '',
			numberVerses: payload?.numberVerses ?? 2,
		} satisfies PayloadKarsaSyair;
	}, [data]);

	const form = useForm<PayloadKarsaSyair>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaSyairSchema, { sync: true }),
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
			data-slot="FormKarsaSyair"
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
						app: 'syair',
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
										Menentukan bahasa yang digunakan pada keseluruhan syair.
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
					<Select
						label="Jenis"
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
										Mengarahkan tema, tujuan, dan karakter isi syair sesuai
										kategori yang dipilih.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="type"
						required
						key={form.key('type')}
						readOnly={isLoading}
						maxDropdownHeight={160}
						data={optionsKarsaSyairType}
						placeholder="Pilih jenis syair"
						{...form.getInputProps('type')}
					/>
					<Select
						label="Gaya bahasa"
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
										Mengatur teknik ungkap, pilihan majas, citraan, dan kesan
										emosional syair.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="tone"
						required
						key={form.key('tone')}
						readOnly={isLoading}
						maxDropdownHeight={160}
						data={optionsKarsaSyairTone}
						placeholder="Pilih gaya bahasa syair"
						{...form.getInputProps('tone')}
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
										Menyesuaikan kosakata, kedalaman pesan, dan kelayakan syair
										bagi pembaca sasaran. Jika opsi yang tersedia belum sesuai,
										Anda dapat memasukkan pilihan lain sesuai kebutuhan.
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
										Menjadi pokok tema, peristiwa, dan pesan yang dikembangkan
										dari bait ke bait.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="topic"
						maxLength={karasInputMaxLength.prompt}
						required
						key={form.key('topic')}
						readOnly={isLoading}
						placeholder="Contoh: semangat menjaga persatuan"
						{...form.getInputProps('topic')}
					/>
					<NumberInput
						label="Jumlah bait"
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
										Menentukan target panjang syair dan ruang pengembangan
										cerita atau pesannya.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="numberVerses"
						required
						max={karsaNumericInputMax.syair.numberVerses}
						key={form.key('numberVerses')}
						readOnly={isLoading}
						placeholder="Contoh: 4"
						leftSection={<PiTextColumns size={18} />}
						{...form.getInputProps('numberVerses')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Buat {labelAppName.syair}
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
