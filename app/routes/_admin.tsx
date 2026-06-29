import { Outlet, redirect } from 'react-router';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import Footer from '~app-ui/layouts/footer';
import { HeaderAdmin } from '~app-ui/layouts/header';

import type { Route } from './+types/_admin';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authMiddlewareSession({
		guard: {
			role: ['ADMIN'],
		},
		request,
	});

	if ('error' in authSession) {
		if (authSession.cause === 'user_not_authorized_role') {
			throw redirect('/apps');
		}

		throw redirect('/login?redirect=/admin');
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

export default function Admin({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderAdmin authUser={loaderData.user} />
			<main className="site-main">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
