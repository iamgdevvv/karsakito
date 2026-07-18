import {
	Alert,
	Box,
	Button,
	Group,
	SimpleGrid,
	Stack,
	Textarea,
	TextInput,
	type BoxProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { useFetcher } from 'react-router';
import { PayloadContactSchema, type PayloadContact } from '~app-modules/schema/contact';
import type { ActionSendEmailContact } from '~app-server/email';

export default function FormContact(props: BoxProps) {
	const fetcher = useFetcher<ActionSendEmailContact>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isLoading = useMemo(() => {
		return fetcher.state !== 'idle';
	}, [fetcher.state]);

	const form = useForm<PayloadContact>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadContactSchema, { sync: true }),
		onSubmitPreventDefault: 'validation-failed',
		onValuesChange: () => {
			if (errorMessage) {
				fetcher.reset();
				setErrorMessage(null);
			}
		},
	});

	useEffect(() => {
		notifications.clean();

		if (!isLoading && fetcher.data) {
			if (fetcher.data?.error) {
				setErrorMessage(fetcher.data.error);
			} else if (fetcher.data?.success) {
				form.reset();
			}
		}
	}, [fetcher.data, isLoading]);

	return (
		<Box
			{...props}
			data-slot="FormCreateKarsaApp"
		>
			{fetcher.data?.success ? (
				<Alert
					color="green"
					title="Pesan terkirim"
					mb="md"
					role="status"
					aria-live="polite"
				>
					Terima kasih. Pesan Anda sudah kami terima dan akan kami tindak lanjuti.
				</Alert>
			) : errorMessage ? (
				<Alert
					color="red"
					title="Pesan belum terkirim"
					mb="md"
					role="alert"
				>
					{errorMessage}
				</Alert>
			) : null}
			<fetcher.Form
				method="post"
				onSubmit={form.onSubmit((values, e) => {
					e?.preventDefault();
					setErrorMessage(null);
					fetcher.submit(values, {
						method: 'post',
					});
				})}
			>
				<Stack gap="xs">
					<SimpleGrid
						spacing="xs"
						cols={{
							base: 1,
							md: 2,
						}}
					>
						<TextInput
							label="Nama Lengkap"
							placeholder="Contoh: Budi Santoso"
							name="name"
							autoComplete="name"
							key={form.key('name')}
							readOnly={isLoading}
							required
							{...form.getInputProps('name')}
						/>
						<TextInput
							label="Alamat email"
							placeholder="nama@contoh.com"
							type="email"
							name="email"
							autoComplete="email"
							spellCheck={false}
							key={form.key('email')}
							readOnly={isLoading}
							required
							{...form.getInputProps('email')}
						/>
						<TextInput
							label="Nomor HP/WhatsApp"
							placeholder="Contoh: 0812 3456 7890"
							type="tel"
							name="phone"
							autoComplete="tel"
							inputMode="tel"
							key={form.key('phone')}
							readOnly={isLoading}
							required
							{...form.getInputProps('phone')}
						/>
						<TextInput
							label="Nama instansi atau organisasi"
							placeholder="Contoh: Kito Kreatif"
							name="organization"
							autoComplete="organization"
							key={form.key('organization')}
							readOnly={isLoading}
							{...form.getInputProps('organization')}
						/>
					</SimpleGrid>
					<Textarea
						label="Pesan Anda"
						placeholder="Ceritakan kebutuhan atau pertanyaan Anda"
						name="message"
						autoComplete="off"
						key={form.key('message')}
						readOnly={isLoading}
						required
						{...form.getInputProps('message')}
					/>
					<Group
						mt="md"
						justify="flex-end"
					>
						<Button
							type="submit"
							loading={isLoading}
							rightSection={<FiSend size={18} />}
						>
							Kirim Pesan
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
