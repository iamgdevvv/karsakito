import type { LocalBusinessLeaf, PostalAddressLeaf } from 'schema-dts';
import { absoluteUrl, type SitePath } from '~app-modules/seo/config';

export type LocalBusinessSchemaInput = {
	name: string;
	path: SitePath;
	address: {
		streetAddress: string;
		addressLocality: string;
		addressCountry: string;
		addressRegion?: string;
		postalCode?: string;
	};
	email?: string;
	telephone?: string;
	priceRange?: string;
	imagePath?: SitePath;
	openingHours?: readonly string[];
};

export const localBusinessSchema = (input: LocalBusinessSchemaInput): LocalBusinessLeaf => {
	const address: PostalAddressLeaf = {
		'@type': 'PostalAddress',
		streetAddress: input.address.streetAddress,
		addressLocality: input.address.addressLocality,
		addressRegion: input.address.addressRegion,
		postalCode: input.address.postalCode,
		addressCountry: input.address.addressCountry,
	};

	return {
		'@type': 'LocalBusiness',
		'@id': `${absoluteUrl(input.path)}#local-business`,
		name: input.name,
		url: absoluteUrl(input.path),
		address,
		email: input.email,
		telephone: input.telephone,
		priceRange: input.priceRange,
		image: input.imagePath ? absoluteUrl(input.imagePath) : undefined,
		openingHours: input.openingHours,
	};
};
