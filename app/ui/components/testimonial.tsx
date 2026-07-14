import { Avatar, Flex, Stack, Text, ThemeIcon, type StackProps } from '@mantine/core';
import { TbMessage } from 'react-icons/tb';

export function TestimonialCard({
	data,
	...props
}: StackProps & {
	data: {
		name: string;
		position: string;
		quote: string;
	};
}) {
	return (
		<Stack
			h="100%"
			bg="gray.0"
			bdrs="xl"
			bd="1px solid gray.2"
			p={{
				base: 'md',
				sm: 'lg',
				md: 'xl',
			}}
			{...props}
		>
			<ThemeIcon
				variant="light"
				size="xl"
				radius="full"
			>
				<TbMessage size={20} />
			</ThemeIcon>
			<Text
				fs="italic"
				size="lg"
			>
				"{data.quote}"
			</Text>
			<Flex
				align="center"
				mt="auto"
				pt="xl"
			>
				<Avatar
					variant="light"
					name={data.name}
					w={60}
					miw={60}
					h={60}
					bdrs="full"
				/>
				<Stack
					gap={0}
					pl="xs"
					w="100%"
				>
					<Text span>{data.name}</Text>
					<Text
						span
						size="sm"
						c="gray.6"
					>
						{data.position}
					</Text>
				</Stack>
			</Flex>
		</Stack>
	);
}
