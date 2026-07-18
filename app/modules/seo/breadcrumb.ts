import type { BreadcrumbListLeaf, ListItemLeaf } from 'schema-dts';
import { absoluteUrl, breadcrumbId, type SitePath } from '~app-modules/seo/config';

export type BreadcrumbSchemaItem = {
	name: string;
	path: SitePath;
};

export type BreadcrumbSchemaItems = readonly [
	BreadcrumbSchemaItem,
	BreadcrumbSchemaItem,
	...BreadcrumbSchemaItem[],
];

export const breadcrumbSchema = (
	pagePath: SitePath,
	items: BreadcrumbSchemaItems,
): BreadcrumbListLeaf => {
	const itemListElement: ListItemLeaf[] = items.map((item, index) => ({
		'@type': 'ListItem',
		position: index + 1,
		name: item.name,
		item: absoluteUrl(item.path),
	}));

	return {
		'@type': 'BreadcrumbList',
		'@id': breadcrumbId(pagePath),
		itemListElement,
	};
};
