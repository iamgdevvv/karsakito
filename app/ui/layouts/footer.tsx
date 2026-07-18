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
						© {new Date().getFullYear()} Tim Kito. Hak cipta dilindungi.
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
						Peserta PIDI - DIGDAYA X Hackathon 2026
					</Text>
				</Group>
			</Container>
		</Box>
	);
}
