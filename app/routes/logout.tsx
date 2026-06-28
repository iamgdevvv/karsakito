import { redirect } from 'react-router';
import { metaDashboard } from '~app-modules/meta';
import { authGetSession, authLogoutSession } from '~app-server/session';

import type { Route } from './+types/logout';

export function meta() {
	return metaDashboard({
		title: 'Sign out',
	});
}

export async function loader({ request }: Route.LoaderArgs) {
	const session = await authGetSession(request);
	const routeAfterLogout = new URL(request.url).searchParams.get('_redirect') || '/';

	return redirect(routeAfterLogout, {
		headers: {
			'Set-Cookie': await authLogoutSession(session),
		},
	});
}
