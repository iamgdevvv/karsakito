import { Title } from '@mantine/core';
import { replace } from 'react-router';
import { metaAdminRoute } from '~app-modules/meta';
import { actionUpdateBalanceUser } from '~app-server/balance';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import { actionGetUser } from '~app-server/user';
import { messageActionError } from '~app-server/utils';
import FormBalanceUser from '~app-ui/form/balance-user';
import Footer from '~app-ui/layouts/footer';
import { HeaderAdmin } from '~app-ui/layouts/header';
import { AdminPanel } from '~app-ui/layouts/panel';

import type { Route } from './+types/admin.users.$id.balance.update';

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

export async function loader({ request, context, params }: Route.LoaderArgs) {
	const user = context.get(authUserCtx)!;

	const recordUser = await actionGetUser({
		userId: params.id,
		request,
		context,
	});

	if (!recordUser.data) {
		throw replace('/');
	}

	return {
		user,
		recordUser: recordUser.data,
	};
}

export async function action({ request, context, params }: Route.ActionArgs) {
	return await actionUpdateBalanceUser({
		userId: params.id,
		request,
		context,
	});
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaAdminRoute({
		title: `Sesuaikan Saldo Token ${loaderData.recordUser.name}`,
	});
}

export default function BalanceUserAdminRoute({ loaderData, params }: Route.ComponentProps) {
	return (
		<div className="site">
			<HeaderAdmin authUser={loaderData.user} />
			<AdminPanel
				authUser={loaderData.user}
				className="site-main"
			>
				<Title mb="lg">Sesuaikan Saldo Token</Title>
				<FormBalanceUser
					userId={params.id}
					maw={400}
				/>
			</AdminPanel>
			<Footer />
		</div>
	);
}
