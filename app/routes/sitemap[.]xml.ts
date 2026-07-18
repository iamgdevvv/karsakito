import { absoluteUrl, indexableSitePaths, isCanonicalSiteRequest } from '~app-modules/seo';

export function loader({ request }: { request: Request }) {
	if (!isCanonicalSiteRequest(request)) {
		return new Response('Sitemap hanya tersedia di domain utama KarsaKito.', {
			status: 404,
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'Cache-Control': 'no-store',
				'X-Robots-Tag': 'noindex, nofollow',
			},
		});
	}

	const urls = indexableSitePaths
		.map((path) => `\t<url>\n\t\t<loc>${absoluteUrl(path)}</loc>\n\t</url>`)
		.join('\n');
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400',
		},
	});
}
