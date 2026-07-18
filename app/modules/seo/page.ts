import type {
	AboutPageLeaf,
	CollectionPageLeaf,
	ContactPageLeaf,
	FAQPageLeaf,
	ImageObjectLeaf,
	WebPageLeaf,
} from 'schema-dts';
import {
	absoluteUrl,
	breadcrumbId,
	seoConfig,
	seoIds,
	type SitePath,
	webPageId,
} from '~app-modules/seo/config';

export type PageSchemaType = 'WebPage' | 'AboutPage' | 'CollectionPage' | 'ContactPage' | 'FAQPage';

export type PageSchemaInput = {
	name: string;
	description: string;
	path: SitePath;
	type?: PageSchemaType;
	hasBreadcrumb?: boolean;
	primaryImage?: {
		path: SitePath;
		width: number;
		height: number;
		caption?: string;
	};
};

export type PageSchema =
	| WebPageLeaf
	| AboutPageLeaf
	| CollectionPageLeaf
	| ContactPageLeaf
	| FAQPageLeaf;

export const pageSchema = (input: PageSchemaInput): PageSchema => {
	const image: ImageObjectLeaf | undefined = input.primaryImage
		? {
				'@type': 'ImageObject',
				url: absoluteUrl(input.primaryImage.path),
				contentUrl: absoluteUrl(input.primaryImage.path),
				width: String(input.primaryImage.width),
				height: String(input.primaryImage.height),
				caption: input.primaryImage.caption,
			}
		: undefined;

	const base: Omit<WebPageLeaf, '@type'> = {
		'@id': webPageId(input.path),
		url: absoluteUrl(input.path),
		name: input.name,
		description: input.description,
		inLanguage: seoConfig.language,
		isPartOf: { '@id': seoIds.website },
		publisher: { '@id': seoIds.organization },
		about: { '@id': seoIds.organization },
		breadcrumb: input.hasBreadcrumb ? { '@id': breadcrumbId(input.path) } : undefined,
		primaryImageOfPage: image,
	};

	switch (input.type) {
		case 'AboutPage':
			return { '@type': 'AboutPage', ...base };
		case 'CollectionPage':
			return { '@type': 'CollectionPage', ...base };
		case 'ContactPage':
			return { '@type': 'ContactPage', ...base };
		case 'FAQPage':
			return { '@type': 'FAQPage', ...base };
		default:
			return { '@type': 'WebPage', ...base };
	}
};
