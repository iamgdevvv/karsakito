import { metaPublicRoute } from '~app-modules/meta';

export function meta() {
	return metaPublicRoute({
		title: 'Blog KarsaKito',
		noIndex: true,
	});
}

export default function BlogRoute() {
	return <div className="p-8 text-2xl">Daftar Artikel Blog</div>;
}
