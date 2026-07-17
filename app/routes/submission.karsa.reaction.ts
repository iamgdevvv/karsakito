import { replace } from 'react-router';
import { actionSubmissionReactionKarsaAI } from '~app-server/workspace';

import type { Route } from './+types/submission.karsa.reaction';

export async function action({ request, context }: Route.LoaderArgs) {
	return await actionSubmissionReactionKarsaAI({
		request,
		context,
	});
}

export async function loader() {
	return replace('/');
}
