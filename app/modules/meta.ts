import type { MetaDescriptor } from 'react-router';

export function metaPublic(
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
			content: !noIndex ? 'index, follow' : 'noindex, nofollow',
		},
	];
}

export function metaDashboard(
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
			title: `${title} | KarsaKito`,
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

export function metaAdmin(
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
