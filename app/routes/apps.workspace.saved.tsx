import { Title } from '@mantine/core';
import { redirect } from 'react-router';
import { metaPublicRoute } from '~app-modules/meta';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import AppPanel from '~app-ui/layouts/apps-panel';

import type { Route } from './+types/apps.workspace._index';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authMiddlewareSession({
		request,
	});

	if ('error' in authSession) {
		throw redirect('/login?redirect=/apps/workspace');
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

export default function SavedWorkspaceAppsRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<AppPanel className="site-main">
				<Title>Koleksi Workspace {loaderData.user.name}</Title>
			</AppPanel>
		</div>
	);
}
