import { Box, Container, Group, Text, type BoxProps } from '@mantine/core';

export default function Footer(props: BoxProps) {
	return (
		<Box
			pos="sticky"
			top={0}
			w="100%"
			bg="black"
			c="white"
			py="xl"
			{...props}
			component="footer"
			data-slot="Footer"
		>
			<Container>
				<Group justify="center">
					<Text
						span
						size="sm"
					>
						© {new Date().getFullYear()} Team Kito. All rights reserved.
					</Text>
					<Text
						span
						display="inline-block"
						size="sm"
						ml={{
							lg: 'auto',
						}}
					>
						Hackathon X DIGDAYA 2026 - Bank Indonesia
					</Text>
				</Group>
			</Container>
		</Box>
	);
}
