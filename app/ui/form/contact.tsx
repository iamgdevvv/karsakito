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
					title="Success"
					mb="md"
				>
					Terima kasih telah menghubungi kami. Tim kami telah menerima pesan Anda dan akan
					segera menindaklanjutinya.
				</Alert>
			) : errorMessage ? (
				<Alert
					color="red"
					title="Error"
					mb="md"
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
							name="name"
							key={form.key('name')}
							readOnly={isLoading}
							required
							{...form.getInputProps('name')}
						/>
						<TextInput
							label="Alamat Email"
							type="email"
							name="email"
							key={form.key('email')}
							readOnly={isLoading}
							required
							{...form.getInputProps('email')}
						/>
						<TextInput
							label="Nomor HP/Whatsapp"
							type="tel"
							name="phone"
							key={form.key('phone')}
							readOnly={isLoading}
							required
							{...form.getInputProps('phone')}
						/>
						<TextInput
							label="Nama Instansi/Organisasi"
							name="organization"
							key={form.key('organization')}
							readOnly={isLoading}
							{...form.getInputProps('organization')}
						/>
					</SimpleGrid>
					<Textarea
						label="Pesan Anda"
						name="message"
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
