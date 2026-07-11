import { replace } from 'react-router';
import { metaPublicRoute } from '~app-modules/meta';
import { authGetSession, authLogoutSession } from '~app-server/session';

import type { Route } from './+types/logout';

export function meta() {
	return metaPublicRoute({
		title: 'Sign out',
		noIndex: true,
	});
}

export async function loader({ request }: Route.LoaderArgs) {
	const session = await authGetSession(request);
	const routeAfterLogout = new URL(request.url).searchParams.get('redirect') || '/';

	return replace(routeAfterLogout, {
		headers: {
			'Set-Cookie': await authLogoutSession(session),
		},
	});
}
