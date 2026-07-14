import { Title } from '@mantine/core';
import { replace } from 'react-router';
import { metaPublicRoute } from '~app-modules/meta';
import { authUserCtx } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import AppPanel from '~app-ui/layouts/apps-panel';

import type { Route } from './+types/workspace._index';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	if (!user) {
		const redirectParams = new URLSearchParams();
		const queryParams = request.url.split('?')[1];
		let redirectLink = '/workspace/saved';

		if (queryParams) {
			redirectLink += `?${queryParams}`;
		}

		redirectParams.set('redirect', redirectLink);

		throw replace(`/login?${redirectParams.toString()}`);
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
