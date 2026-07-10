import { redirect } from 'react-router';
import { metaAdminRoute } from '~app-modules/meta';
import { actionDeleteUser } from '~app-server/user';

import type { Route } from './+types/admin.users.$id.delete';

export async function loader({ request, context, params }: Route.LoaderArgs) {
	const deleteUser = await actionDeleteUser({
		userId: params.id,
		request,
		context,
	});

	if ('error' in deleteUser) {
		return redirect('/logout');
	}

	return redirect(`/admin/users?successMessage=${deleteUser.data.name}`);
}

export function meta() {
	return metaAdminRoute({
		title: 'Delete User',
	});
}
