import { Title } from '@mantine/core';
import { replace } from 'react-router';
import { metaDashboardRoute } from '~app-modules/meta';
import { authUserCtx } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import { actionUpdateProfile } from '~app-server/user';
import FormProfile from '~app-ui/form/profile';
import Footer from '~app-ui/layouts/footer';
import { HeaderDashboard } from '~app-ui/layouts/header';
import { DashboardPanel } from '~app-ui/layouts/panel';

import type { Route } from './+types/dashboard.profile';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	if (!user) {
		const redirectParams = new URLSearchParams();
		const queryParams = request.url.split('?')[1];
		let redirectLink = '/dashboard/profile';

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

export async function action({ request, context }: Route.ActionArgs) {
	return await actionUpdateProfile({
		request,
		context,
	});
}

export function meta(_: Route.MetaArgs) {
	return metaDashboardRoute({
		title: 'Profil',
	});
}

export default function ProfileDashboardRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderDashboard authUser={loaderData.user} />
			<DashboardPanel className="site-main">
				<Title mb="lg">Perbarui profil</Title>
				<FormProfile
					data={loaderData.user}
					maw={400}
				/>
			</DashboardPanel>
			<Footer />
		</div>
	);
}
