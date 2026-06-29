import { redirect } from 'react-router';
import { authMiddlewareSession } from '~app-server/session';

import type { Route } from './+types/_auth';

const authMiddleware: Route.MiddlewareFunction = async ({ request }) => {
	const authSession = await authMiddlewareSession({
		request,
	});

	if ('user' in authSession) {
		if (authSession.user.role === 'ADMIN') {
			throw redirect('/admin');
		}

		throw redirect('/apps');
	}
};

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];
