import { Title } from '@mantine/core';
import { metaPublic } from '~app-modules/meta';
import { cloudflareContext } from '~workers/app';

import type { Route } from './+types/_page.tentang-kami';

export function loader({ context }: Route.LoaderArgs) {
	return {
		noIndex: context.get(cloudflareContext).env.NODE_ENV !== 'production',
	};
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaPublic({
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
