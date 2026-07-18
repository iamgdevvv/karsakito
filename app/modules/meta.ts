import type { MetaDescriptor } from 'react-router';

const defaultPublicDescription =
	'KarsaKito membantu Anda membuat, menyempurnakan, menerjemahkan, dan mengolah teks melalui alur kerja AI yang terstruktur.';

export function metaPublicRoute(
	{
		title,
		description,
		noIndex,
	}: {
		title: string;
		description?: string;
		noIndex?: boolean;
	},
	extra?: MetaDescriptor[],
): MetaDescriptor[] {
	const meta: MetaDescriptor[] = [
		{
			title,
		},
	];

	if (description || !noIndex) {
		meta.push({
			name: 'description',
			content: description || defaultPublicDescription,
		});
	}

	return [
		...(extra || []),
		...meta,
		{
			name: 'robots',
			content: !noIndex ? 'index, follow' : 'noindex, nofollow',
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
