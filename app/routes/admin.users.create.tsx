import { Title } from '@mantine/core';
import { replace } from 'react-router';
import { metaAdminRoute } from '~app-modules/meta';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import { actionCreateUser } from '~app-server/user';
import { messageActionError } from '~app-server/utils';
import FormCreateUser from '~app-ui/form/create-user';
import Footer from '~app-ui/layouts/footer';
import { HeaderAdmin } from '~app-ui/layouts/header';
import { AdminPanel } from '~app-ui/layouts/panel';

import type { Route } from './+types/admin.users.create';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authMiddlewareSession({
		guard: {
			role: ['ADMIN'],
		},
		request,
	});

	if ('error' in authSession) {
		const redirectParams = new URLSearchParams();
		redirectParams.set('errorMessage', messageActionError(authSession));

		throw replace(`/?${redirectParams.toString()}`);
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

export async function action({ request, context }: Route.ActionArgs) {
	return await actionCreateUser({
		request,
		context,
	});
}

export function meta(_: Route.MetaArgs) {
	return metaAdminRoute({
		title: 'Buat Pengguna',
	});
}

export default function CreateUserAdminRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderAdmin authUser={loaderData.user} />
			<AdminPanel
				authUser={loaderData.user}
				className="site-main"
			>
				<Title mb="lg">Buat Pengguna</Title>
				<FormCreateUser maw={400} />
			</AdminPanel>
			<Footer />
		</div>
	);
}
