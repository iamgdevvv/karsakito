import { Outlet } from 'react-router';
import { authGetSession } from '~app-server/session';
import Footer from '~app-ui/layouts/footer';
import { Header } from '~app-ui/layouts/header';

import type { Route } from './+types/_page';

export async function loader({ request }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	return {
		user,
	};
}

export default function Page({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<Header authUser={loaderData.user} />
			<main className="site-main">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
