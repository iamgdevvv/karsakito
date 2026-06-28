import { redirect } from 'react-router';
import { authGetSession } from '~app-server/session';

import type { Route } from './+types/_auth';

const authMiddleware: Route.MiddlewareFunction = async ({ request }) => {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	if (user) {
		if (user.role === 'ADMIN') {
			throw redirect('/admin');
		}

		throw redirect('/apps');
	}
};

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];
