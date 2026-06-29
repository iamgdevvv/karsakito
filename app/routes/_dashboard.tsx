import { Outlet, redirect } from 'react-router';
import { authUserCtx } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import Footer from '~app-ui/layouts/footer';
import { HeaderDashboard } from '~app-ui/layouts/header';

import type { Route } from './+types/_apps';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	if (!user) {
		throw redirect('/login?redirect=/dashboard');
	}

	context.set(authUserCtx, user);
};

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
	const user = context.get(authUserCtx)!;

	return {
		user,
	};
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderDashboard authUser={loaderData.user} />
			<main className="site-main">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
