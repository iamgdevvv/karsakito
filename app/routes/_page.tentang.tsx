import { Title } from '@mantine/core';
import { metaPublicRoute } from '~app-modules/meta';
import { cloudflareContext } from '~workers/app';

import type { Route } from './+types/_page.tentang';

export function loader({ context }: Route.LoaderArgs) {
	return {
		noIndex: context.get(cloudflareContext).env.NODE_ENV !== 'production',
	};
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaPublicRoute({
		title: 'Tentang KarsaKito',
		noIndex: loaderData.noIndex,
	});
}

export default function AboutRoute(_: Route.ComponentProps) {
	return (
		<>
			<Title>Tentang KarsaKito</Title>
		</>
	);
}
