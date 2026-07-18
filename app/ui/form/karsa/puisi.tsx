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
import { optionsKarsaWriterAudience, optionsLanguageApp } from '~app-modules/enum-options';
import {
	PayloadKarsaPuisiSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaPuisi,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

const optionsKarsaPuisiType = [
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

const optionsKarsaPuisiStyle = [
	'Bebas (Kontemporer)',
	'Berima Rapat (A-A-A-A)',
	'Berima Silang (A-B-A-B)',
];

const optionsKarsaPuisiEffect = [
	'Dominan Metafora (Kiasan)',
	'Dominan Personifikasi',
	'Lugas (Tanpa Kiasan Rumit)',
	'Campuran (Dinamis)',
];

export default function FormKarsaPuisi({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaPuisi;
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
		const payload = PayloadKarsaPuisiSchema.safeParse(data).data;

		return {
			language: payload?.language || 'indonesia',
			type: payload?.type || 'Nasihat',
			audience: payload?.audience || '',
			style: payload?.style || 'Bebas (Kontemporer)',
			effect: payload?.effect || 'Campuran (Dinamis)',
			topic: payload?.topic || '',
			numberVerses: payload?.numberVerses ?? 2,
		} satisfies PayloadKarsaPuisi;
	}, [data]);

	const form = useForm<PayloadKarsaPuisi>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaPuisiSchema, { sync: true }),
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
			data-slot="FormKarsaPuisi"
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
						app: 'puisi',
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
						name="type"
						required
						key={form.key('type')}
						readOnly={isLoading}
						maxDropdownHeight={160}
						data={optionsKarsaPuisiType}
						placeholder="Pilih jenis puisi"
						{...form.getInputProps('type')}
					/>
					<Select
						label="Gaya"
						name="style"
						required
						key={form.key('style')}
						readOnly={isLoading}
						maxDropdownHeight={160}
						data={optionsKarsaPuisiStyle}
						placeholder="Pilih gaya puisi"
						{...form.getInputProps('style')}
					/>
					<Select
						label="Gaya bahasa"
						name="effect"
						required
						key={form.key('effect')}
						readOnly={isLoading}
						maxDropdownHeight={160}
						data={optionsKarsaPuisiEffect}
						placeholder="Pilih gaya bahasa"
						{...form.getInputProps('effect')}
					/>
					<Autocomplete
						label="Audiens"
						name="audience"
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
						name="topic"
						required
						key={form.key('topic')}
						readOnly={isLoading}
						placeholder="Contoh: keindahan pantai saat senja"
						{...form.getInputProps('topic')}
					/>
					<NumberInput
						label="Jumlah bait"
						name="numberVerses"
						required
						max={20}
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
							Buat puisi
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
