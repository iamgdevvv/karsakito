import type { MetaDescriptor } from 'react-router';
import type { Graph } from 'schema-dts';
import { absoluteUrl, seoConfig, type SitePath } from '~app-modules/seo';

export function metaPublicRoute(
	{
		title,
		description = seoConfig.description,
		noIndex,
		canonicalPath,
		structuredData,
	}: {
		title: string;
		description?: string;
		noIndex?: boolean;
		canonicalPath?: SitePath;
		structuredData?: Graph;
	},
	extra?: MetaDescriptor[],
): MetaDescriptor[] {
	const canonicalUrl = canonicalPath ? absoluteUrl(canonicalPath) : undefined;
	const shareImageUrl = absoluteUrl(seoConfig.shareImage.path);
	const meta: MetaDescriptor[] = [
		{
			title,
		},
		{
			name: 'description',
			content: description,
		},
	];

	if (!noIndex) {
		meta.push(
			{ property: 'og:type', content: 'website' },
			{ property: 'og:site_name', content: seoConfig.name },
			{ property: 'og:locale', content: seoConfig.locale },
			{ property: 'og:title', content: title },
			{ property: 'og:description', content: description },
			{ property: 'og:image', content: shareImageUrl },
			{ property: 'og:image:width', content: String(seoConfig.shareImage.width) },
			{ property: 'og:image:height', content: String(seoConfig.shareImage.height) },
			{ property: 'og:image:alt', content: seoConfig.shareImage.alt },
			{ name: 'twitter:card', content: 'summary_large_image' },
			{ name: 'twitter:title', content: title },
			{ name: 'twitter:description', content: description },
			{ name: 'twitter:image', content: shareImageUrl },
			{ name: 'twitter:image:alt', content: seoConfig.shareImage.alt },
		);

		if (canonicalUrl) {
			meta.push(
				{ tagName: 'link', rel: 'canonical', href: canonicalUrl },
				{ property: 'og:url', content: canonicalUrl },
			);
		}

		if (structuredData) {
			meta.push({ 'script:ld+json': structuredData });
		}
	}

	return [
		...(extra || []),
		...meta,
		{
			name: 'robots',
			content: !noIndex
				? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
				: 'noindex, nofollow, noarchive',
		},
	];
}

export function metaAppsRoute(
	{
		title,
		description,
	}: {
		title: string;
		description?: string;
	},
	extra?: MetaDescriptor[],
): MetaDescriptor[] {
	const meta: MetaDescriptor[] = [
		{
			title: `${title} | Apps KarsaKito`,
		},
	];

	if (description) {
		meta.push({
			name: 'description',
			content: description,
		});
	}

	return [
		...(extra || []),
		...meta,
		{
			name: 'robots',
			content: 'noindex, nofollow',
		},
	];
}

export function metaDashboardRoute(
	{
		title,
		description,
	}: {
		title: string;
		description?: string;
	},
	extra?: MetaDescriptor[],
): MetaDescriptor[] {
	const meta: MetaDescriptor[] = [
		{
			title: `${title} | Dashboard KarsaKito`,
		},
	];

	if (description) {
		meta.push({
			name: 'description',
			content: description,
		});
	}

	return [
		...(extra || []),
		...meta,
		{
			name: 'robots',
			content: 'noindex, nofollow',
		},
	];
}

export function metaAdminRoute(
	{
		title,
		description,
	}: {
		title: string;
		description?: string;
	},
	extra?: MetaDescriptor[],
): MetaDescriptor[] {
	const meta: MetaDescriptor[] = [
		{
			title: `${title} | Admin KarsaKito`,
		},
	];

	if (description) {
		meta.push({
			name: 'description',
			content: description,
		});
	}

	return [
		...(extra || []),
		...meta,
		{
			name: 'robots',
			content: 'noindex, nofollow',
		},
	];
}
