import type { WebSiteLeaf } from 'schema-dts';
import { absoluteUrl, seoConfig, seoIds } from '~app-modules/seo/config';

export const websiteSchema = (): WebSiteLeaf => ({
	'@type': 'WebSite',
	'@id': seoIds.website,
	url: absoluteUrl('/'),
	name: seoConfig.name,
	description: seoConfig.description,
	inLanguage: seoConfig.language,
	publisher: { '@id': seoIds.organization },
});
