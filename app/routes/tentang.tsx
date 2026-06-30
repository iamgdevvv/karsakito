import { Title } from '@mantine/core';
import { metaPublicRoute } from '~app-modules/meta';
import { authGetSession } from '~app-server/session';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';
import { cloudflareContext } from '~workers/app';

import type { Route } from './+types/tentang';

export async function loader({ request, context }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	return {
		user,
		noIndex: context.get(cloudflareContext).env.NODE_ENV !== 'production',
	};
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaPublicRoute({
		title: 'Tentang KarsaKito',
		noIndex: loaderData.noIndex,
	});
}

export default function AboutRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<Header authUser={loaderData.user} />
			<main className="site-main">
				<Title>Tentang KarsaKito</Title>
			</main>
			<Footer />
		</div>
	);
}
