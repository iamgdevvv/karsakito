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

	const redirectParams = new URLSearchParams();
	redirectParams.set('successMessage', `Delete user ${deleteUser.data.name} successfully`);

	return redirect(`/admin/users?${redirectParams.toString()}`);
}

export function meta() {
	return metaAdminRoute({
		title: 'Delete User',
	});
}
