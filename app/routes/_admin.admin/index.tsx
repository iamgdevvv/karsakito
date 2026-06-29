import { Container, Title } from '@mantine/core';
import { metaAdminRoute } from '~app-modules/meta';

import type { Route } from './+types/index';

export function meta(_: Route.MetaArgs) {
	return metaAdminRoute({
		title: 'Dashboard',
	});
}

export default function AdminRoute() {
	return (
		<Container>
			<Title>Admin KarsaKito</Title>
		</Container>
	);
}
