import { Container, Title } from '@mantine/core';
import { metaPublicRoute } from '~app-modules/meta';

import type { Route } from './+types/index';

export function meta(_: Route.MetaArgs) {
	return metaPublicRoute({
		title: 'Dashboard KarsaKito',
		noIndex: true,
	});
}

export default function DashboardRoute() {
	return (
		<Container>
			<Title>Dashboard KarsaKito</Title>
		</Container>
	);
}
