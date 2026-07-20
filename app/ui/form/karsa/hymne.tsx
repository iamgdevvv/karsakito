import {
	Alert,
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
import { labelAppName, optionsLanguageApp } from '~app-modules/enum-options';
import {
	karasInputMaxLength,
	karsaNumericInputMax,
	PayloadKarsaHymneSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaHymne,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

const optionsKarsaHymneType = [
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

const optionsKarsaHymneStructure = [
	'Dengan Reff (Chorus Berulang)',
	'Tanpa Reff (Strofik / Mengalir)',
	'Bentuk Mars (Cepat & Tegas)',
];

export default function FormKarsaHymne({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaHymne;
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
		const payload = PayloadKarsaHymneSchema.safeParse(data).data;

		return {
			language: payload?.language || 'indonesia',
			type: payload?.type || 'Nasihat',
			institution: payload?.institution || '',
			structure: payload?.structure || 'Dengan Reff (Chorus Berulang)',
			topic: payload?.topic || '',
			numberVerses: payload?.numberVerses ?? 2,
		} satisfies PayloadKarsaHymne;
	}, [data]);

	const form = useForm<PayloadKarsaHymne>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaHymneSchema, { sync: true }),
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
			data-slot="FormKarsaHymne"
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
						app: 'hymne',
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
										Menentukan bahasa yang digunakan pada seluruh lirik hymne.
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
										Mengarahkan karakter hymne, suasana, dan tujuan emosional
										lirik.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="type"
						required
						key={form.key('type')}
						readOnly={isLoading}
						maxDropdownHeight={160}
						data={optionsKarsaHymneType}
						placeholder="Pilih jenis hymne"
						{...form.getInputProps('type')}
					/>
					<TextInput
						label="Instansi atau organisasi"
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
										Menjadi identitas utama yang dimuliakan dan dirujuk secara
										konsisten dalam hymne.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="institution"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('institution')}
						readOnly={isLoading}
						placeholder="Misal: Sekolah, Universitas, Komunitas"
						{...form.getInputProps('institution')}
					/>
					<Select
						label="Struktur"
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
										Menentukan susunan bagian lirik, seperti bait dan refrein,
										agar hasil mengikuti bentuk yang diinginkan.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="structure"
						required
						key={form.key('structure')}
						readOnly={isLoading}
						maxDropdownHeight={160}
						data={optionsKarsaHymneStructure}
						placeholder="Pilih struktur hymne"
						{...form.getInputProps('structure')}
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
										Menetapkan nilai, sejarah, cita-cita, atau semangat utama
										yang diangkat dalam lirik.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="topic"
						maxLength={karasInputMaxLength.prompt}
						required
						key={form.key('topic')}
						readOnly={isLoading}
						placeholder="Contoh: semangat belajar dan berkarya"
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
										Menentukan target panjang lirik dan ruang pengembangan pesan
										hymne.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="numberVerses"
						required
						max={karsaNumericInputMax.hymne.numberVerses}
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
							Buat {labelAppName.hymne}
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
