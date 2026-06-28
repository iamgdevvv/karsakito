import { Center, Container } from '@mantine/core';
import { metaDashboard } from '~app-modules/meta';
import { actionFormRegister } from '~app-server/auth';
import FormRegister from '~app-ui/form/register';

import type { Route } from './+types/_auth.login';

export async function action({ request, context }: Route.ActionArgs) {
	return await actionFormRegister({
		formData: await request.formData(),
		context,
	});
}

export function meta(_: Route.MetaArgs) {
	return metaDashboard({
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
