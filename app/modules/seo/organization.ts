import type { ImageObjectLeaf, OrganizationLeaf } from 'schema-dts';
import { absoluteUrl, seoConfig, seoIds } from '~app-modules/seo/config';

export type OrganizationSchemaOptions = {
	sameAs?: readonly string[];
};

export const organizationSchema = (options: OrganizationSchemaOptions = {}): OrganizationLeaf => {
	const logo: ImageObjectLeaf = {
		'@type': 'ImageObject',
		'@id': `${absoluteUrl('/favicon.svg')}#logo`,
		url: absoluteUrl('/favicon.svg'),
		contentUrl: absoluteUrl('/favicon.svg'),
		caption: 'KarsaKito',
		width: '512',
		height: '512',
	};

	return {
		'@type': 'Organization',
		'@id': seoIds.organization,
		name: seoConfig.name,
		url: absoluteUrl('/'),
		description: seoConfig.description,
		email: seoConfig.email,
		logo,
		image: logo,
		sameAs: options.sameAs?.length ? options.sameAs : undefined,
	};
};
