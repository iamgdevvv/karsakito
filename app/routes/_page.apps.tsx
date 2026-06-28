import { Stack, Title } from '@mantine/core';
import { redirect } from 'react-router';
import { metaPublic } from '~app-modules/meta';
import { authGetSession } from '~app-server/session';
import { ButtonLink } from '~app-ui/components/link';

import type { Route } from './+types/_page.apps';

export async function loader({ request }: Route.LoaderArgs) {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	if (!user) {
		throw redirect('/login');
	}

	return {
		user,
	};
}

export function meta(_: Route.MetaArgs) {
	return metaPublic({
		title: 'Apps KarsaKito',
		noIndex: true,
	});
}

export default function Route({ loaderData }: Route.ComponentProps) {
	return (
		<>
			<Stack>
				<Title>Apps KarsaKito</Title>
				<pre>{JSON.stringify(loaderData, null, 2)}</pre>
				<ButtonLink
					to="/logout"
					replace
					color="red"
					variant="light"
				>
					Logout
				</ButtonLink>
			</Stack>
		</>
	);
}
