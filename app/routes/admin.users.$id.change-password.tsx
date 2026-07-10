import { Title } from '@mantine/core';
import { redirect } from 'react-router';
import { metaAdminRoute } from '~app-modules/meta';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import { actionGetUser, actionUpdateUserPassword } from '~app-server/user';
import FormChangePasswordUser from '~app-ui/form/change-password-user';
import Footer from '~app-ui/layouts/footer';
import { HeaderAdmin } from '~app-ui/layouts/header';
import { AdminPanel } from '~app-ui/layouts/panel';

import type { Route } from './+types/admin.users.$id._index';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context, params }) => {
	const authSession = await authMiddlewareSession({
		guard: {
			role: ['ADMIN'],
		},
		request,
	});

	if ('error' in authSession) {
		if (authSession.cause === 'user_not_authorized_role') {
			throw redirect('/');
		}

		throw redirect(`/login?redirect=/admin/users/${params.id}/change-password`);
	}

	context.set(authUserCtx, authSession.user);
};

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context, params }: Route.LoaderArgs) {
	const user = context.get(authUserCtx)!;
	const recordUser = await actionGetUser({
		userId: params.id,
		request,
		context,
	});

	if (!recordUser.data) {
		throw redirect('/admin/users');
	}

	return {
		user,
		recordUser: recordUser.data,
	};
}

export async function action({ request, context }: Route.ActionArgs) {
	return await actionUpdateUserPassword({
		request,
		context,
	});
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaAdminRoute({
		title: `Change Password User ${loaderData.recordUser.name}`,
	});
}

export default function ChangePasswordUserAdminRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderAdmin authUser={loaderData.user} />
			<AdminPanel
				authUser={loaderData.user}
				className="site-main"
			>
				<Title mb="lg">Change Password User</Title>
				<FormChangePasswordUser
					data={loaderData.recordUser}
					maw={400}
				/>
			</AdminPanel>
			<Footer />
		</div>
	);
}
