import { Title } from '@mantine/core';
import { redirect } from 'react-router';
import { metaAdminRoute } from '~app-modules/meta';
import { actionCreateKarsaApp } from '~app-server/app';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import FormCreateKarsaApp from '~app-ui/form/create-app';
import Footer from '~app-ui/layouts/footer';
import { HeaderAdmin } from '~app-ui/layouts/header';
import { AdminPanel } from '~app-ui/layouts/panel';

import type { Route } from './+types/admin.apps.create';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authMiddlewareSession({
		guard: {
			role: ['ADMIN', 'STAFF'],
		},
		request,
	});

	if ('error' in authSession) {
		if (authSession.cause === 'user_not_authorized_role') {
			throw redirect('/');
		}

		throw redirect('/login?redirect=/admin/apps/create');
	}

	context.set(authUserCtx, authSession.user);
};

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
	const app = context.get(authUserCtx)!;

	return {
		app,
	};
}

export async function action({ request, context }: Route.ActionArgs) {
	return await actionCreateKarsaApp({
		request,
		context,
	});
}

export function meta(_: Route.MetaArgs) {
	return metaAdminRoute({
		title: 'Create App',
	});
}

export default function CreateKarsaAppAdminRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderAdmin authUser={loaderData.app} />
			<AdminPanel
				authUser={loaderData.app}
				className="site-main"
			>
				<Title mb="lg">Create App</Title>
				<FormCreateKarsaApp maw={400} />
			</AdminPanel>
			<Footer />
		</div>
	);
}
