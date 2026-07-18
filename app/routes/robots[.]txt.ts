import { absoluteUrl, isCanonicalSiteRequest } from '~app-modules/seo';

export function loader({ request }: { request: Request }) {
	if (!isCanonicalSiteRequest(request)) {
		return new Response('User-agent: *\nDisallow: /\n', {
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'Cache-Control': 'no-store',
			},
		});
	}

	const robots = [
		'User-agent: *',
		'Allow: /',
		'Disallow: /admin',
		'Disallow: /cron',
		'Disallow: /dashboard',
		'Disallow: /submission',
		'Disallow: /workspace',
		`Sitemap: ${absoluteUrl('/sitemap.xml')}`,
	].join('\n');

	return new Response(`${robots}\n`, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400',
		},
	});
}
