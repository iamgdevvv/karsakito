import { Title } from '@mantine/core';
import { redirect } from 'react-router';
import { metaPublicRoute } from '~app-modules/meta';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import Footer from '~app-ui/layouts/footer';
import { HeaderApps } from '~app-ui/layouts/header';

import type { Route } from './+types/apps._index';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authMiddlewareSession({
		request,
	});

	if ('error' in authSession) {
		const sourceUrl = new URL(request.url);

		throw redirect(`/login?redirect=${sourceUrl.pathname}${sourceUrl.search}`);
	}

	context.set(authUserCtx, authSession.user);
};

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
	const user = context.get(authUserCtx)!;

	return {
		user,
	};
}

export function meta(_: Route.MetaArgs) {
	return metaPublicRoute({
		title: 'Apps KarsaKito',
		noIndex: true,
	});
}

export default function AppsRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderApps authUser={loaderData.user} />
			<main className="site-main">
				<Title>Overview Apps</Title>
			</main>
			<Footer />
		</div>
	);
}
