import { Box, Button, type BoxProps, type ButtonProps } from '@mantine/core';
import {
	Link as BaseLink,
	NavLink as BaseNavLink,
	type LinkProps,
	type NavLinkProps,
} from 'react-router';

export function Link({ viewTransition, ...props }: BoxProps & LinkProps) {
	return (
		<Box
			{...props}
			data-slot="Link"
			component={BaseLink}
			viewTransition={viewTransition ?? true}
		/>
	);
}

export function NavLink(props: NavLinkProps) {
	return (
		<BaseNavLink
			end
			{...props}
			data-slot="NavLink"
		/>
	);
}

export function ButtonLink(props: ButtonProps & Omit<LinkProps, 'style' | 'fill'>) {
	return (
		<Button
			component={BaseLink}
			{...props}
			data-slot="ButtonLink"
		/>
	);
}
