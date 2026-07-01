import { Box, Container, Group, Text, type BoxProps } from '@mantine/core';

export default function Footer(props: BoxProps) {
	return (
		<Box
			pos="sticky"
			top={0}
			w="100%"
			bg="black"
			c="white"
			py={{
				base: 'lg',
				lg: 'xl',
			}}
			{...props}
			component="footer"
			data-slot="Footer"
		>
			<Container>
				<Group
					gap="xs"
					justify="center"
				>
					<Text
						span
						fz={{
							base: 'xs',
							lg: 'sm',
						}}
					>
						© {new Date().getFullYear()} Team Kito. All rights reserved.
					</Text>
					<Text
						span
						display="inline-block"
						ml={{
							lg: 'auto',
						}}
						fz={{
							base: 'xs',
							lg: 'sm',
						}}
					>
						Hackathon X DIGDAYA 2026 - Bank Indonesia
					</Text>
				</Group>
			</Container>
		</Box>
	);
}
