import { Box, type BoxProps } from '@mantine/core';
import type { ComponentProps } from 'react';
import { Link as LinkX, NavLink as NavLinkX } from 'react-router';

export function Link({ viewTransition, ...props }: ComponentProps<typeof LinkX> & BoxProps) {
	return <Box {...props} component={LinkX} viewTransition={viewTransition ?? true} />;
}

export function NavLink({ viewTransition, ...props }: ComponentProps<typeof NavLinkX> & BoxProps) {
	return <Box {...props} component={NavLinkX} viewTransition={viewTransition ?? true} />;
}
