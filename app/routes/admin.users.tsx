import { Title } from '@mantine/core';
import { redirect } from 'react-router';
import { metaAdminRoute } from '~app-modules/meta';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import Footer from '~app-ui/layouts/footer';
import { HeaderAdmin } from '~app-ui/layouts/header';
import { AdminPanel } from '~app-ui/layouts/panel';

import type { Route } from './+types/admin.users';

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

		throw redirect('/login?redirect=/admin/users');
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
	return metaAdminRoute({
		title: 'Manage Users',
	});
}

export default function Admin({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderAdmin authUser={loaderData.user} />
			<AdminPanel className="site-main">
				<Title>Manage Users</Title>
			</AdminPanel>
			<Footer />
		</div>
	);
}
