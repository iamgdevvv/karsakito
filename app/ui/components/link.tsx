import { Box, Button, type BoxProps, type ButtonProps } from '@mantine/core';
import { Link as LinkX, type LinkProps } from 'react-router';

export function Link({ viewTransition, ...props }: BoxProps & LinkProps) {
	return (
		<Box
			{...props}
			data-slot="Link"
			component={LinkX}
			viewTransition={viewTransition ?? true}
		/>
	);
}

export function ButtonLink(props: ButtonProps & LinkProps) {
	return (
		<Button
			component={LinkX}
			{...props}
			data-slot="ButtonLink"
		/>
	);
}
