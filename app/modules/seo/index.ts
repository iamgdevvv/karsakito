import type { Graph, Thing } from 'schema-dts';

export const seoSchema = (...graph: readonly Thing[]): Graph => ({
	'@context': 'https://schema.org',
	'@graph': graph,
});

export * from '~app-modules/seo/application';
export * from '~app-modules/seo/breadcrumb';
export * from '~app-modules/seo/config';
export * from '~app-modules/seo/faq';
export * from '~app-modules/seo/local-business';
export * from '~app-modules/seo/organization';
export * from '~app-modules/seo/page';
export * from '~app-modules/seo/website';
