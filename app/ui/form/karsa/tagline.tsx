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
	PayloadKarsaTaglineSchema,
	PayloadSubmissionKarsaSchema,
	type KarsaPlain,
	type PayloadKarsaTagline,
	type PayloadSubmissionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import type { ActionSubmissionKarsaAI } from '~app-server/workspace';

export default function FormKarsaTagline({
	data,
	onError,
	onSubmitProgress,
	onSubmit,
	...props
}: BoxProps & {
	data?: KarsaPlain['promptJson'] | PayloadKarsaTagline;
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
		const payload = PayloadKarsaTaglineSchema.safeParse(data).data;

		return {
			language: payload?.language || 'indonesia',
			entity: payload?.entity || '',
			usp: payload?.usp || '',
			audience: payload?.audience || '',
			tone: payload?.tone || '',
			wordLength: payload?.wordLength ?? 8,
		} satisfies PayloadKarsaTagline;
	}, [data]);

	const form = useForm<PayloadKarsaTagline>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadKarsaTaglineSchema, { sync: true }),
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
			data-slot="FormKarsaTagline"
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
						app: 'tagline',
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
										Menentukan bahasa yang digunakan pada tagline hasil
										generasi.
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
					<TextInput
						label="Nama entitas"
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
										Menetapkan merek, produk, organisasi, atau pribadi yang
										harus diwakili oleh tagline.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="entity"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('entity')}
						readOnly={isLoading}
						placeholder="Contoh: KarsaKito"
						{...form.getInputProps('entity')}
					/>
					<TextInput
						label="Keunggulan utama"
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
										Menjadi manfaat atau pembeda yang paling ditonjolkan agar
										tagline terasa relevan dan meyakinkan.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="usp"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('usp')}
						readOnly={isLoading}
						placeholder="Contoh: tool AI berbahasa Indonesia yang praktis"
						{...form.getInputProps('usp')}
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
										Menyesuaikan kosakata, daya tarik, dan sudut pesan kepada
										calon pengguna atau pelanggan sasaran. Jika opsi yang
										tersedia belum sesuai, Anda dapat memasukkan pilihan lain
										sesuai kebutuhan.
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
					<Autocomplete
						label="Gaya"
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
										Mengatur nada dan kesan tagline, seperti unik, ramah,
										klasik, atau penuh semangat. Jika opsi yang tersedia belum
										sesuai, Anda dapat memasukkan pilihan lain sesuai kebutuhan.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="tone"
						maxLength={karasInputMaxLength.short}
						required
						key={form.key('tone')}
						readOnly={isLoading}
						placeholder="Pilih atau tulis gaya tagline"
						maxDropdownHeight={160}
						data={[
							'Unik',
							'Mudah Diingat',
							'Semangat',
							'Menggebu',
							'Ramah',
							'Klasik',
							'Mengayomi',
						]}
						{...form.getInputProps('tone')}
					/>
					<NumberInput
						label="Jumlah kata"
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
										Menentukan target kepanjangan tagline; hasil tetap dapat
										sedikit menyesuaikan agar enak dibaca.
									</Text>
								</HoverCard.Dropdown>
							</HoverCard>
						}
						name="wordLength"
						required
						max={20}
						key={form.key('wordLength')}
						readOnly={isLoading}
						placeholder="Contoh: 5"
						leftSection={<PiTextColumns size={18} />}
						{...form.getInputProps('wordLength')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Buat {labelAppName.tagline}
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
