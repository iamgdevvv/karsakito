import {
	ActionIcon,
	Alert,
	Box,
	Button,
	Group,
	Input,
	Stack,
	Textarea,
	Tooltip,
	type BoxProps,
} from '@mantine/core';
import { schemaResolver, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import { LuThumbsDown, LuThumbsUp } from 'react-icons/lu';
import { useFetcher } from 'react-router';
import {
	PayloadSubmissionReactionKarsaSchema,
	type PayloadSubmissionReactionKarsa,
} from '~app-modules/schema/karsa';
import type { ActionSubmissionReactionKarsaAI } from '~app-server/workspace';

export default function FormKarsaReaction({
	data,
	onSubmit,
	...props
}: BoxProps & {
	data: PayloadSubmissionReactionKarsa;
	onSubmit?: (values: Pick<PayloadSubmissionReactionKarsa, 'feedback' | 'reaction'>) => void;
}) {
	const fetcher = useFetcher<ActionSubmissionReactionKarsaAI>();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const isLoading = useMemo(() => {
		return fetcher.state !== 'idle';
	}, [fetcher.state]);

	const form = useForm<PayloadSubmissionReactionKarsa>({
		mode: 'uncontrolled',
		validate: schemaResolver(PayloadSubmissionReactionKarsaSchema, { sync: true }),
		onSubmitPreventDefault: 'validation-failed',
		initialValues: data,
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
			if ('error' in fetcher.data && fetcher.data.error) {
				form.setValues(data);

				setErrorMessage(fetcher.data.error);
			} else if ('data' in fetcher.data) {
				if (onSubmit) {
					onSubmit(fetcher.data.data);
				}

				notifications.show({
					title: 'Berhasil',
					message: 'Terima kasih. Penilaian Anda telah disimpan.',
				});
			}
		}
	}, [fetcher.data, isLoading]);

	return (
		<Box
			{...props}
			data-slot="FormKarsaReaction"
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
				action="/submission/karsa/reaction"
				onSubmit={form.onSubmit((values, e) => {
					e?.preventDefault();
					setErrorMessage(null);
					fetcher.submit(values, {
						method: 'post',
						action: '/submission/karsa/reaction',
					});
				})}
			>
				<Stack gap="xs">
					<Input
						type="hidden"
						name="karsaId"
						key={form.key('karsaId')}
						{...form.getInputProps('karsaId')}
					/>
					<Group gap={4}>
						<Tooltip
							label="Sesuai kebutuhan"
							fz="xs"
						>
							<ActionIcon
								variant={form.values.reaction ? 'filled' : 'light'}
								color="green"
								onClick={() => form.setFieldValue('reaction', true)}
							>
								<LuThumbsUp />
							</ActionIcon>
						</Tooltip>
						<Tooltip
							label="Perlu diperbaiki"
							fz="xs"
						>
							<ActionIcon
								variant={form.values.reaction === false ? 'filled' : 'light'}
								color="orange"
								onClick={() => form.setFieldValue('reaction', false)}
							>
								<LuThumbsDown />
							</ActionIcon>
						</Tooltip>
					</Group>
					<Textarea
						label="Umpan balik"
						placeholder="Ceritakan hal yang sudah membantu atau perlu diperbaiki"
						name="feedback"
						key={form.key('feedback')}
						readOnly={isLoading}
						required
						{...form.getInputProps('feedback')}
					/>
					<Group
						gap="xs"
						justify="flex-end"
						mt="md"
					>
						<Button
							type="submit"
							loading={isLoading}
						>
							Kirim Penilaian
						</Button>
					</Group>
				</Stack>
			</fetcher.Form>
		</Box>
	);
}
