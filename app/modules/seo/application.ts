import type { WebApplicationLeaf } from 'schema-dts';
import { absoluteUrl, seoConfig, seoIds } from '~app-modules/seo/config';

export const webApplicationSchema = (): WebApplicationLeaf => ({
	'@type': 'WebApplication',
	'@id': seoIds.webApplication,
	name: seoConfig.name,
	url: absoluteUrl('/'),
	description: seoConfig.description,
	applicationCategory: 'BusinessApplication',
	operatingSystem: 'Web',
	browserRequirements: 'Memerlukan peramban modern dengan JavaScript aktif.',
	inLanguage: seoConfig.language,
	featureList: [
		'Menyusun draf tulisan dari parameter yang terarah',
		'Menyempurnakan dan memparafrasekan teks',
		'Menerjemahkan teks dengan pilihan bahasa yang tersedia',
		'Menganalisis penggunaan bahasa dan konteks teks',
	],
	publisher: { '@id': seoIds.organization },
	isPartOf: { '@id': seoIds.website },
});
