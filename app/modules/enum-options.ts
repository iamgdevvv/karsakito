import type { LanguageApp } from '~app-modules/schema/app';
import { TimezoneSchema } from '~app-modules/schema/enum';
import {
	BalanceActivityType,
	type KarsaAppsCategory,
	type KarsaAppsName,
	type UserRole,
} from '~generated/prisma/enums';

export const amountTokenDaily = 100;

export const labelLanguageApp = {
	indonesia: 'Bahasa Indonesia',
	minang: 'Bahasa Minang',
	jawa: 'Bahasa Jawa',
	sunda: 'Bahasa Sunda',
} as const satisfies Record<LanguageApp, string>;

export const optionsLanguageApp = Object.entries(labelLanguageApp).map(([value, label]) => ({
	label,
	value,
}));

export const labelAppName = {
	pidato: 'Pidato',
	pantun: 'Pantun',
	syair: 'Syair',
	puisi: 'Puisi',
	hymne: 'Hymne',
	ceritapendek: 'Cerita Pendek',
	ceritapanjang: 'Cerita Panjang',
	doabersama: 'Doa Bersama',
	petuah: 'Petuah',
	tagline: 'Tagline',
	slogan: 'Slogan',
	motto: 'Motto',
	tekateki: 'Teka Teki',
	parafrase: 'Parafrasa',
	adaptasidialek: 'Adaptasi Dialek',
	rangkuman: 'Rangkuman',
	analisakalimat: 'Analisa Kalimat',
	analisadokumen: 'Analisa Dokumen',
	terjemahankalimat: 'Terjemahan Kalimat',
	terjemahandokumen: 'Terjemahan Dokumen',
	peribahasa: 'Peribahasa',
	adatistiadat: 'Adat Istiadat',
	sejarah: 'Sejarah',
	artefak: 'Artefak',
} as const satisfies Record<KarsaAppsName, string>;

export const optionsAppName = Object.entries(labelAppName).map(([value, label]) => ({
	label,
	value,
}));

export const labelAppCategory = {
	karsawriter: 'KarsaWriter',
	karsalator: 'KarsaLator',
	karsalisa: 'KarsaLisa',
	karsafrase: 'KarsaFrase',
	karsapedia: 'KarsaPedia',
} as const satisfies Record<KarsaAppsCategory, string>;

export const optionsAppCategory = Object.entries(labelAppCategory).map(([value, label]) => ({
	label,
	value,
}));

export const labelUserRole = {
	ADMIN: 'Admin',
	STAFF: 'Staff',
	CUSTOMER: 'Customer',
} as const satisfies Record<UserRole, string>;

export const optionsUserRole = Object.entries(labelUserRole).map(([value, label]) => ({
	label,
	value,
}));

export const labelActivityType = {
	DAILY_BONUS: 'Bonus Harian',
	GIVEAWAY: 'Hadiah',
	KARSA: 'Penggunaan AI',
	PURCHASE: 'Pembelian Token',
} as const satisfies Record<BalanceActivityType, string>;

export const optionsTimezone = Object.values(TimezoneSchema.enum);

export const optionsKarsaWriterAudience = [
	'Anak-anak',
	'Muda-mudi',
	'Orang Tua/Masyarakat Umum',
	'Tokoh / Pemangku Jabatan',
];

export const optionsKarsaFrasePreference = ['Ringkas', 'Normal', 'Elaborasi'];

export const optionsKarsaLisaAudience = [
	'Orang Tua',
	'Teman Sebaya',
	'Lebih Muda',
	'Saudara Sebaya',
];
