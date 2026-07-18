import { replace } from 'react-router';
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
		return replace('/logout');
	}

	const redirectParams = new URLSearchParams();
	redirectParams.set('successMessage', `Pengguna ${deleteUser.data.name} berhasil dihapus.`);

	return replace(`/admin/users?${redirectParams.toString()}`);
}

export function meta() {
	return metaAdminRoute({
		title: 'Hapus Pengguna',
	});
}
