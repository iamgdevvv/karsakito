import {
	Box,
	Container,
	Flex,
	Group,
	Stack,
	type ButtonProps,
	type ImageProps,
	type StackProps,
} from '@mantine/core';
import type { ReactNode } from 'react';
import type { LinkProps } from 'react-router';
import { ButtonLink } from '~app-ui/components/link';

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
		<Flex
			pos="relative"
			mih={480}
			py={{
				base: 60,
				sm: 80,
				lg: 120,
			}}
			c="white"
			direction="column"
			justify="center"
			component="section"
			data-slot="Banner"
			className="bg-cover bg-fixed bg-center bg-no-repeat"
			style={{
				...props.style,
				backgroundImage: background ? `url(${background})` : undefined,
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
		</Flex>
	);
}
