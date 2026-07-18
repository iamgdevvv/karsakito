import { Title } from '@mantine/core';
import { replace } from 'react-router';
import { metaAdminRoute } from '~app-modules/meta';
import { actionCreateKarsaApp } from '~app-server/app';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import { messageActionError } from '~app-server/utils';
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
		const redirectParams = new URLSearchParams();
		redirectParams.set('errorMessage', messageActionError(authSession));

		throw replace(`/?${redirectParams.toString()}`);
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
		title: 'Buat Aplikasi',
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
				<Title mb="lg">Buat Aplikasi</Title>
				<FormCreateKarsaApp maw={400} />
			</AdminPanel>
			<Footer />
		</div>
	);
}
