import {
	Alert,
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
import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { PiCoinsFill } from 'react-icons/pi';
import { useFetcher, useNavigate } from 'react-router';
import { PayloadUpdateBalanceSchema, type PayloadUpdateBalance } from '~app-modules/schema/balance';
import type { ActionUpdateBalanceUser } from '~app-server/balance';

export default function FormBalanceUser({
	userId,
	...props
}: BoxProps & {
	userId: string;
}) {
	const navigate = useNavigate();
	const fetcher = useFetcher<ActionUpdateBalanceUser>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isLoading = useMemo(() => {
		return fetcher.state !== 'idle';
	}, [fetcher.state]);

	const form = useForm<PayloadUpdateBalance>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadUpdateBalanceSchema, { sync: true }),
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
			} else if (fetcher.data?.data) {
				const redirectParams = new URLSearchParams();
				redirectParams.set('successMessage', 'Balance updated successfully');

				navigate(`/admin/users/${userId}/balance?${redirectParams.toString()}`);
			}
		}
	}, [fetcher.data, isLoading]);

	return (
		<Box
			{...props}
			data-slot="FormBalanceUser"
		>
			{errorMessage ? (
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
					<Select
						label="Type"
						name="type"
						key={form.key('type')}
						readOnly={isLoading}
						data={
							[
								'DAILY_BONUS',
								'GIVEAWAY',
								'PURCHASE',
							] satisfies PayloadUpdateBalance['type'][]
						}
						{...form.getInputProps('type')}
					/>
					<NumberInput
						label={form.values.type === 'DAILY_BONUS' ? 'Daily Token' : 'Token'}
						name="token"
						key={form.key('token')}
						readOnly={isLoading}
						leftSection={<PiCoinsFill size={18} />}
						{...form.getInputProps('token')}
					/>
					<Textarea
						label="Description"
						name="description"
						key={form.key('description')}
						readOnly={isLoading}
						{...form.getInputProps('description')}
					/>
					<Group justify="flex-end">
						<Button
							type="submit"
							loading={isLoading}
							mt="md"
						>
							Update Balance
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
