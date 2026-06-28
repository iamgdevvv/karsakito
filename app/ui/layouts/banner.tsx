import {
	Box,
	Container,
	Group,
	Stack,
	type ButtonProps,
	type ImageProps,
	type StackProps,
} from '@mantine/core';
import type { ReactNode } from 'react';
import { ButtonLink, type LinkProps } from '~app-ui/components/link';

type Props = {
	children: ReactNode;
	background?: ImageProps['src'];
	ctas?: ({
		label: string;
	} & LinkProps &
		ButtonProps)[];
} & StackProps;

export default function Banner({ background, ctas, children, ...props }: Props) {
	return (
		<Box
			pos="relative"
			component="section"
			py={{
				base: 60,
				sm: 80,
				lg: 120,
			}}
			c="white"
			role="banner"
			data-slot="banner"
			className="bg-cover bg-fixed bg-center bg-no-repeat"
			style={{
				backgroundImage: `url(${background})`,
			}}
		>
			{background ? (
				<Box
					pos="absolute"
					top={0}
					left={0}
					w="100%"
					h="100%"
					bg="black"
					opacity={0.88}
				/>
			) : null}

			<Container
				pos="relative"
				size="sm"
			>
				<Stack
					gap="sm"
					{...props}
				>
					{children}
					{ctas?.length ? (
						<Group
							gap="xs"
							mt="md"
						>
							{ctas.map((cta, key) => (
								<ButtonLink
									key={`${cta.label}-${key}`}
									{...cta}
								>
									{cta.label}
								</ButtonLink>
							))}
						</Group>
					) : null}
				</Stack>
			</Container>
		</Box>
	);
}
