import { Title } from '@mantine/core';
import { redirect } from 'react-router';
import { metaDashboardRoute } from '~app-modules/meta';
import { authUserCtx } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import { actionChangePassword } from '~app-server/user';
import FormChangePassword from '~app-ui/form/change-password';
import Footer from '~app-ui/layouts/footer';
import { HeaderDashboard } from '~app-ui/layouts/header';
import { DashboardPanel } from '~app-ui/layouts/panel';

import type { Route } from './+types/dashboard.change-password';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	if (!user) {
		throw redirect('/login?redirect=/dashboard/change-password');
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

export async function action({ request, context }: Route.ActionArgs) {
	return await actionChangePassword({
		request,
		context,
	});
}

export function meta(_: Route.MetaArgs) {
	return metaDashboardRoute({
		title: 'Change Password',
	});
}

export default function UsageDashboardRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderDashboard authUser={loaderData.user} />
			<DashboardPanel className="site-main">
				<Title mb="lg">Change Password</Title>
				<FormChangePassword maw={400} />
			</DashboardPanel>
			<Footer />
		</div>
	);
}
