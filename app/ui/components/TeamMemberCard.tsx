import { Card, Avatar, Text, Stack, Box, List, ThemeIcon } from '@mantine/core';
import { useState } from 'react';
import { FiCheck } from 'react-icons/fi';

interface TeamMemberCardProps {
	name: string;
	role: string;
	image: string | null;
	focus: string[];
}

export function TeamMemberCard({ name, role, image, focus }: TeamMemberCardProps) {
	const [hovered, setHovered] = useState(false);

	const initials = name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.substring(0, 2);

	return (
		<Card
			shadow={hovered ? 'md' : 'sm'}
			padding="xl"
			radius="lg"
			withBorder
			style={{
				borderColor: '#e2e8f0',
				height: '100%',
				transition: 'transform 0.2s ease, box-shadow 0.2s ease',
				transform: hovered ? 'translateY(-5px)' : 'none',
				cursor: 'default',
			}}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<Stack
				align="center"
				gap="md"
			>
				<Avatar
					src={image}
					alt={name}
					size={120}
					radius="100%"
					color="blue"
					style={{ border: '4px solid #f8fafc' }}
				>
					{initials}
				</Avatar>

				<Stack
					align="center"
					gap={4}
				>
					<Text
						fw={800}
						size="xl"
						c="slate.9"
						ta="center"
					>
						{name}
					</Text>
					<Text
						fw={600}
						size="md"
						c="blue.6"
						ta="center"
					>
						{role}
					</Text>
				</Stack>

				<Box
					mt="md"
					w="100%"
				>
					<List
						spacing="sm"
						size="sm"
						center
						icon={
							<ThemeIcon
								color="slate.3"
								size={20}
								radius="xl"
								variant="transparent"
							>
								<FiCheck
									size={14}
									color="#94a3b8"
								/>
							</ThemeIcon>
						}
					>
						{focus.map((item, index) => (
							<List.Item key={index}>
								<Text
									size="sm"
									c="slate.5"
									style={{ lineHeight: 1.4 }}
								>
									{item}
								</Text>
							</List.Item>
						))}
					</List>
				</Box>
			</Stack>
		</Card>
	);
}
