import { redirect } from 'react-router';
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
		return redirect('/logout');
	}

	const redirectParams = new URLSearchParams();
	redirectParams.set(
		'successMessage',
		`Delete app ${labelAppName[deleteApp.data.name]} successfully`,
	);

	return redirect(`/admin/apps?${redirectParams.toString()}`);
}

export function meta() {
	return metaAdminRoute({
		title: 'Delete App',
	});
}
