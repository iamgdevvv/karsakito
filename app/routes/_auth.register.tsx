import { Center, Container } from '@mantine/core';
import { metaAppsRoute } from '~app-modules/meta';
import { actionRegister } from '~app-server/auth';
import FormRegister from '~app-ui/form/register';

import type { Route } from './+types/_auth.register';

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
			<Container size="xs">
				<FormRegister />
			</Container>
		</Center>
	);
}
