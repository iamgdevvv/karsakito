import { Center, Container } from '@mantine/core';
import { replace } from 'react-router';
import { metaAppsRoute } from '~app-modules/meta';
import { actionRegister } from '~app-server/auth';
import { authMiddlewareSession } from '~app-server/session';
import FormRegister from '~app-ui/form/register';

import type { Route } from './+types/register';

const authMiddleware: Route.MiddlewareFunction = async ({ request }) => {
	const authSession = await authMiddlewareSession({
		request,
	});

	if ('user' in authSession) {
		if (['ADMIN', 'STAFF'].includes(authSession.user.role)) {
			throw replace('/admin');
		}

		throw replace('/apps');
	}
};

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function action({ request, context }: Route.ActionArgs) {
	return await actionRegister({
		request,
		context,
	});
}

export function meta(_: Route.MetaArgs) {
	return metaAppsRoute({
		title: 'Sign up',
	});
}

export default function LoginRoute(_: Route.ComponentProps) {
	return (
		<Center
			mih="100vh"
			bg="primary.1"
		>
			<Container
				size="xs"
				className="not-lg:self-start not-lg:pt-6"
			>
				<FormRegister />
			</Container>
		</Center>
	);
}
