import { replace } from 'react-router';
import { actionSubmissionKarsaAI } from '~app-server/workspace';

import type { Route } from './+types/submission.karsa';

export async function action({ request, context }: Route.LoaderArgs) {
	return await actionSubmissionKarsaAI({
		request,
		context,
	});
}

export async function loader() {
	return replace('/');
}
