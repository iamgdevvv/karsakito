import { Outlet, redirect } from 'react-router';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import Footer from '~app-ui/layouts/footer';
import { HeaderApps } from '~app-ui/layouts/header';

import type { Route } from './+types/_apps';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authMiddlewareSession({
		request,
	});

	if ('error' in authSession) {
		throw redirect('/login?redirect=/apps');
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

export default function Apps({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderApps authUser={loaderData.user} />
			<main className="site-main">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
