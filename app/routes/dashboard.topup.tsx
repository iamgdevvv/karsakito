import { Text, Title } from '@mantine/core';
import { replace } from 'react-router';
import { metaDashboardRoute } from '~app-modules/meta';
import { authUserCtx } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import Footer from '~app-ui/layouts/footer';
import { HeaderDashboard } from '~app-ui/layouts/header';
import { DashboardPanel } from '~app-ui/layouts/panel';
import FormTopup from '~app-ui/form/topup';

import type { Route } from './+types/dashboard.topup';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	if (!user) {
		const redirectParams = new URLSearchParams();
		const queryParams = request.url.split('?')[1];
		let redirectLink = '/dashboard/topup';

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
	return metaDashboardRoute({
		title: 'Topup Token',
	});
}

export default function TopupDashboardRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderDashboard authUser={loaderData.user} />
			<DashboardPanel className="site-main">
				<Title mb="xs">Topup Token</Title>
				<Text
					c="dimmed"
					size="sm"
					mb="lg"
				>
					Beli token reguler untuk memakai Karsa AI lebih banyak.
				</Text>
				<FormTopup />
			</DashboardPanel>
			<Footer />
		</div>
	);
}
