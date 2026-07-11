import { Box, Button, type BoxProps, type ButtonProps } from '@mantine/core';
import {
	Link as BaseLink,
	NavLink as BaseNavLink,
	type LinkProps,
	type NavLinkProps,
} from 'react-router';

export function Link(props: BoxProps & LinkProps) {
	return (
		<Box
			discover="none"
			viewTransition={true}
			{...props}
			data-slot="Link"
			component={BaseLink}
		/>
	);
}

export function NavLink(props: NavLinkProps) {
	return (
		<BaseNavLink
			end
			discover="none"
			viewTransition={true}
			{...props}
			data-slot="NavLink"
		/>
	);
}

export function ButtonLink(props: ButtonProps & Omit<LinkProps, 'style' | 'fill'>) {
	return (
		<Button
			component={BaseLink}
			discover="none"
			viewTransition={true}
			{...props}
			data-slot="ButtonLink"
		/>
	);
}
