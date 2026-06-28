import { Box, type BoxProps, Button, type ButtonProps } from '@mantine/core';
import type { ComponentProps } from 'react';
import { Link as LinkX, NavLink as NavLinkX } from 'react-router';

export type LinkProps = ComponentProps<typeof LinkX> & BoxProps;

export type NavLinkProps = ComponentProps<typeof NavLinkX> & BoxProps;

export type ButtonLinkProps = ComponentProps<typeof LinkX> & ButtonProps;

export function Link({ viewTransition, ...props }: LinkProps) {
	return (
		<Box
			{...props}
			component={LinkX}
			viewTransition={viewTransition ?? true}
		/>
	);
}

export function NavLink({ viewTransition, ...props }: NavLinkProps) {
	return (
		<Box
			{...props}
			component={NavLinkX}
			viewTransition={viewTransition ?? true}
		/>
	);
}

export function ButtonLink(props: ButtonLinkProps) {
	return (
		<Button
			component={LinkX}
			{...props}
		/>
	);
}
