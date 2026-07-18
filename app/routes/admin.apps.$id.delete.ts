import { replace } from 'react-router';
import { labelAppName } from '~app-modules/enum-options';
import { metaAdminRoute } from '~app-modules/meta';
import { actionDeleteKarsaApp } from '~app-server/app';

import type { Route } from './+types/admin.apps.$id.delete';

export async function loader({ request, context, params }: Route.LoaderArgs) {
	const deleteApp = await actionDeleteKarsaApp({
		karsaAppId: params.id,
		request,
		context,
	});

	if ('error' in deleteApp) {
		return replace('/logout');
	}

	const redirectParams = new URLSearchParams();
	redirectParams.set(
		'successMessage',
		`Aplikasi ${labelAppName[deleteApp.data.name]} berhasil dihapus.`,
	);

	return replace(`/admin/apps?${redirectParams.toString()}`);
}

export function meta() {
	return metaAdminRoute({
		title: 'Hapus Aplikasi',
	});
}
