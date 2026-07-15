import { metaPublicRoute } from '~app-modules/meta';

import type { Route } from './+types/blog.$slug';

export function meta() {
	return metaPublicRoute({
		title: 'Detail Blog KarsaKito',
		noIndex: true,
	});
}

export default function DetailBlogRoute({ params }: Route.ComponentProps) {
	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold">Membaca Artikel: {params.slug}</h1>
		</div>
	);
}
