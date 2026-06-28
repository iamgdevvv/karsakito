import { Center, Container } from '@mantine/core';
import { metaDashboard } from '~app-modules/meta';
import { actionFormLogin } from '~app-server/auth';
import FormLogin from '~app-ui/form/login';

import type { Route } from './+types/_auth.login';

export async function action({ request, context }: Route.ActionArgs) {
	return await actionFormLogin({
		formData: await request.formData(),
		request,
		context,
	});
}

export function meta(_: Route.MetaArgs) {
	return metaDashboard({
		title: 'Sign in',
	});
}

export default function LoginRoute(_: Route.ComponentProps) {
	return (
		<Center
			mih="100vh"
			bg="primary.1"
		>
			<Container size="xs">
				<FormLogin />
			</Container>
		</Center>
	);
}
