export type SitePath = '/' | `/${string}`;

export const seoConfig = {
	name: 'KarsaKito',
	origin: 'https://karsakito.web.id',
	language: 'id-ID',
	locale: 'id_ID',
	email: 'info@karsakito.web.id',
	description:
		'KarsaKito membantu Anda membuat, menyempurnakan, menerjemahkan, dan mengolah teks berbasis Bahasa Nusantara melalui alur kerja AI yang terstruktur.',
	shareImage: {
		path: '/images/karsakito-beranda-banner.jpg' as SitePath,
		width: 3480,
		height: 2321,
		alt: 'Perempuan berbusana tradisional memegang topeng di depan galeri lukisan',
	},
} as const;

export const indexableSitePaths = [
	'/',
	'/tentang',
	'/layanan',
	'/biaya-layanan',
	'/hubungi',
	'/faq',
] as const satisfies readonly SitePath[];

export function absoluteUrl(path: SitePath = '/'): string {
	return new URL(path, `${seoConfig.origin}/`).toString();
}

export function isCanonicalSiteRequest(request: Request): boolean {
	return new URL(request.url).origin === seoConfig.origin;
}

export const seoIds = {
	organization: `${absoluteUrl('/')}#organization`,
	website: `${absoluteUrl('/')}#website`,
	webApplication: `${absoluteUrl('/')}#web-application`,
} as const;

export function webPageId(path: SitePath): string {
	return `${absoluteUrl(path)}#webpage`;
}

export function breadcrumbId(path: SitePath): string {
	return `${absoluteUrl(path)}#breadcrumb`;
}
