import { Title } from '@mantine/core';
import { replace } from 'react-router';
import { labelAppName } from '~app-modules/enum-options';
import { metaAdminRoute } from '~app-modules/meta';
import { actionGetKarsaApp, actionUpdateKarsaApp } from '~app-server/app';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import { messageActionError } from '~app-server/utils';
import FormUpdateApp from '~app-ui/form/update-app';
import Footer from '~app-ui/layouts/footer';
import { HeaderAdmin } from '~app-ui/layouts/header';
import { AdminPanel } from '~app-ui/layouts/panel';

import type { Route } from './+types/admin.apps.$id._index';

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

export async function loader({ request, context, params }: Route.LoaderArgs) {
	const user = context.get(authUserCtx)!;
	const recordUser = await actionGetKarsaApp({
		karsaAppId: params.id,
		request,
		context,
	});

	if (!recordUser.data) {
		throw replace('/');
	}

	return {
		user,
		recordApp: recordUser.data,
	};
}

export async function action({ request, context }: Route.ActionArgs) {
	return await actionUpdateKarsaApp({
		request,
		context,
	});
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaAdminRoute({
		title: `App ${labelAppName[loaderData.recordApp.name]}`,
	});
}

export default function DetailKarsaAppAdminRoute({ loaderData }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderAdmin authUser={loaderData.user} />
			<AdminPanel
				authUser={loaderData.user}
				className="site-main"
			>
				<Title mb="lg">Detail App</Title>
				<FormUpdateApp
					data={loaderData.recordApp}
					maw={400}
				/>
			</AdminPanel>
			<Footer />
		</div>
	);
}
