import * as z from 'zod';
import { LanguageAppSchema } from '~app-modules/schema/app';
import { KarsaSchema, WorkspaceWindowSchema } from '~generated/prisma-zod/schemas/models';

export const KarsaSchemaPlain = KarsaSchema.omit({
	promptJson: true,
}).extend({
	promptJson: z.record(z.string(), z.unknown()).optional(),
});

export const PayloadKarsaPidatoSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	purpose: z.string().nonempty(),
	agenda: z.string().nonempty(),
	speaker: z.string().nonempty(),
	audience: z.string().nonempty(),
	topic: z.string().nonempty(),
	totalSentence: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaPantunSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	type: z
		.enum([
			'Nasihat',
			'Jenaka',
			'Cinta',
			'Persahabatan',
			'Petuah',
			'Pendidikan',
			'Agama',
			'Budaya',
			'Adat',
			'Penyambutan',
			'Perpisahan',
			'Ucapan Selamat',
			'Terima Kasih',
			'Permintaan Maaf',
			'Sindiran',
			'Kritik',
			'Teka-Teki',
			'Anak-anak',
			'Lingkungan',
			'Kebangsaan',
		])
		.default('Nasihat'),
	audience: z.string().nonempty(),
	topic: z.string().nonempty(),
	numberVerses: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaSyairSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	type: z
		.enum([
			'Nasihat',
			'Jenaka',
			'Cinta',
			'Persahabatan',
			'Petuah',
			'Pendidikan',
			'Agama',
			'Budaya',
			'Adat',
			'Penyambutan',
			'Perpisahan',
			'Ucapan Selamat',
			'Terima Kasih',
			'Permintaan Maaf',
			'Sindiran',
			'Kritik',
			'Teka-Teki',
			'Anak-anak',
			'Lingkungan',
			'Kepemimpinan',
			'Kebangsaan',
		])
		.default('Nasihat'),
	audience: z.string().nonempty(),
	tone: z
		.enum(['Klasik/Sastra Tinggi', 'Baku/Standar', 'Populer/Santai'])
		.default('Baku/Standar'),
	topic: z.string().nonempty(),
	numberVerses: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaPuisiSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	type: z
		.enum([
			'Nasihat',
			'Jenaka',
			'Cinta',
			'Persahabatan',
			'Petuah',
			'Pendidikan',
			'Agama',
			'Budaya',
			'Adat',
			'Penyambutan',
			'Perpisahan',
			'Ucapan Selamat',
			'Terima Kasih',
			'Permintaan Maaf',
			'Sindiran',
			'Kritik',
			'Teka-Teki',
			'Anak-anak',
			'Lingkungan',
			'Kepemimpinan',
			'Kebangsaan',
		])
		.default('Nasihat'),
	audience: z.string().nonempty(),
	style: z
		.enum(['Bebas (Kontemporer)', 'Berima Rapat (A-A-A-A)', 'Berima Silang (A-B-A-B)'])
		.default('Bebas (Kontemporer)'),
	effect: z
		.enum([
			'Dominan Metafora (Kiasan)',
			'Dominan Personifikasi',
			'Lugas (Tanpa Kiasan Rumit)',
			'Campuran (Dinamis)',
		])
		.default('Campuran (Dinamis)'),
	topic: z.string().nonempty(),
	numberVerses: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaHymneSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	type: z
		.enum([
			'Nasihat',
			'Jenaka',
			'Cinta',
			'Persahabatan',
			'Petuah',
			'Pendidikan',
			'Agama',
			'Budaya',
			'Adat',
			'Penyambutan',
			'Perpisahan',
			'Ucapan Selamat',
			'Terima Kasih',
			'Permintaan Maaf',
			'Sindiran',
			'Kritik',
			'Teka-Teki',
			'Anak-anak',
			'Lingkungan',
			'Kepemimpinan',
			'Kebangsaan',
		])
		.default('Nasihat'),
	institution: z.string().nonempty(),
	structure: z
		.enum([
			'Dengan Reff (Chorus Berulang)',
			'Tanpa Reff (Strofik / Mengalir)',
			'Bentuk Mars (Cepat & Tegas)',
		])
		.default('Dengan Reff (Chorus Berulang)'),
	topic: z.string().nonempty(),
	numberVerses: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaPetuahSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	style: z.string().nonempty(),
	topic: z.string().nonempty(),
});

export const PayloadKarsaTaglineSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	entity: z.string().nonempty(),
	usp: z.string().nonempty(),
	audience: z.string().nonempty(),
	tone: z.string().nonempty(),
	wordLength: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaSloganSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	campaign: z.string().nonempty(),
	audience: z.string().nonempty(),
	tone: z.string().nonempty(),
	wordLength: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaMottoSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	entity: z.string().nonempty(),
	core_value: z.string().nonempty(),
	tone: z.string().nonempty(),
	wordLength: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaCeritaPendekSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	genre: z.string().nonempty(),
	audience: z.string().nonempty(),
	morale: z.string().nonempty(),
	topic: z.string().nonempty(),
	totalParagraph: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaCeritaPanjangSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	genre: z.string().nonempty(),
	audience: z.string().nonempty(),
	morale: z.string().nonempty(),
	topic: z.string().nonempty(),
	totalParagraph: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaDoaBersamaSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	religion: z.string().nonempty(),
	topic: z.string().nonempty(),
	totalSentence: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaTekaTekiSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	type: z.string().nonempty(),
	level: z.string().nonempty(),
	topic: z.string().nonempty(),
});

export const PayloadKarsaParafraseSchema = z.object({
	sourceLanguage: LanguageAppSchema.default('indonesia'),
	targetLanguage: LanguageAppSchema.default('indonesia'),
	preference: z.string().nonempty(),
	text: z.string().nonempty(),
});

export const PayloadKarsaRangkumanSchema = z.object({
	sourceLanguage: LanguageAppSchema.default('indonesia'),
	targetLanguage: LanguageAppSchema.default('indonesia'),
	style: z.string().nonempty(),
	preference: z.string().nonempty(),
	text: z.string().nonempty(),
});

export const PayloadKarsaAdaptasiDialekSchema = z.object({
	sourceLanguage: LanguageAppSchema.default('indonesia'),
	targetLanguage: LanguageAppSchema.default('indonesia'),
	dialect: z.string().nonempty(),
	text: z.string().nonempty(),
});

export const PayloadKarsaTranslateSchema = z.object({
	source_language: LanguageAppSchema.default('indonesia'),
	target_language: LanguageAppSchema.default('minang'),
	info: z.string().nonempty(),
	text: z.string().nonempty(),
});

export const PayloadKarsaTerjemahanKalimatSchema = z.object({
	sourceLanguage: LanguageAppSchema.default('indonesia'),
	targetLanguage: LanguageAppSchema.default('minang'),
	usage: z.string().nonempty(),
	text: z.string().nonempty(),
});

export const PayloadKarsaTerjemahanDokumenSchema = z.object({
	sourceLanguage: LanguageAppSchema.default('indonesia'),
	targetLanguage: LanguageAppSchema.default('minang'),
	info: z.string().nonempty(),
	selectionText: z.string().nonempty(),
});

export const PayloadKarsaAnalisaSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	info: z.string().nonempty(),
	audience: z.string().nonempty(),
	text: z.string().nonempty(),
});

export const PayloadKarsaAnalisaKalimatSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	audience: z.string().nonempty(),
	text: z.string().nonempty(),
});

export const PayloadKarsaAnalisaDokumenSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	info: z.string().nonempty(),
	audience: z.string().nonempty(),
	selectionText: z.string().nonempty(),
});

export const PayloadKarsaSchemaPlain = KarsaSchemaPlain.omit({
	id: true,
	app: true,
	promptJson: true,
	createdAt: true,
	updatedAt: true,
	userId: true,
	balanceActivityId: true,
	result: true,
});

export const PayloadSubmissionKarsaSchema = z
	.object({
		windowWorkspaceId: WorkspaceWindowSchema.shape.id.optional(),
	})
	.and(
		z.discriminatedUnion('app', [
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.pidato),
				payload: PayloadKarsaPidatoSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.pantun),
				payload: PayloadKarsaPantunSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.syair),
				payload: PayloadKarsaSyairSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.puisi),
				payload: PayloadKarsaPuisiSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.hymne),
				payload: PayloadKarsaHymneSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.petuah),
				payload: PayloadKarsaPetuahSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.tagline),
				payload: PayloadKarsaTaglineSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.slogan),
				payload: PayloadKarsaSloganSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.motto),
				payload: PayloadKarsaMottoSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.ceritapendek),
				payload: PayloadKarsaCeritaPendekSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.ceritapanjang),
				payload: PayloadKarsaCeritaPanjangSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.doabersama),
				payload: PayloadKarsaDoaBersamaSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.tekateki),
				payload: PayloadKarsaTekaTekiSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.parafrase),
				payload: PayloadKarsaParafraseSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.rangkuman),
				payload: PayloadKarsaRangkumanSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.adaptasidialek),
				payload: PayloadKarsaAdaptasiDialekSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.terjemahankalimat),
				payload: PayloadKarsaTerjemahanKalimatSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.terjemahandokumen),
				payload: PayloadKarsaTerjemahanDokumenSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.analisakalimat),
				payload: PayloadKarsaAnalisaKalimatSchema,
			}),
			z.object({
				app: z.literal(KarsaSchemaPlain.shape.app.enum.analisadokumen),
				payload: PayloadKarsaAnalisaDokumenSchema,
			}),
		]),
	);

export const PayloadSubmissionReactionKarsaSchema = z.object({
	karsaId: KarsaSchemaPlain.shape.id,
	reaction: KarsaSchemaPlain.shape.reaction.unwrap().unwrap(),
	feedback: KarsaSchemaPlain.shape.feedback.unwrap().unwrap().nonempty(),
});

export type KarsaPlain = z.infer<typeof KarsaSchemaPlain>;
export type PayloadKarsaPidato = z.infer<typeof PayloadKarsaPidatoSchema>;
export type PayloadKarsaPantun = z.infer<typeof PayloadKarsaPantunSchema>;
export type PayloadKarsaSyair = z.infer<typeof PayloadKarsaSyairSchema>;
export type PayloadKarsaPuisi = z.infer<typeof PayloadKarsaPuisiSchema>;
export type PayloadKarsaHymne = z.infer<typeof PayloadKarsaHymneSchema>;
export type PayloadKarsaPetuah = z.infer<typeof PayloadKarsaPetuahSchema>;
export type PayloadKarsaTagline = z.infer<typeof PayloadKarsaTaglineSchema>;
export type PayloadKarsaSlogan = z.infer<typeof PayloadKarsaSloganSchema>;
export type PayloadKarsaMotto = z.infer<typeof PayloadKarsaMottoSchema>;
export type PayloadKarsaCeritaPendek = z.infer<typeof PayloadKarsaCeritaPendekSchema>;
export type PayloadKarsaCeritaPanjang = z.infer<typeof PayloadKarsaCeritaPanjangSchema>;
export type PayloadKarsaDoaBersama = z.infer<typeof PayloadKarsaDoaBersamaSchema>;
export type PayloadKarsaTekaTeki = z.infer<typeof PayloadKarsaTekaTekiSchema>;
export type PayloadKarsaParafrase = z.infer<typeof PayloadKarsaParafraseSchema>;
export type PayloadKarsaRangkuman = z.infer<typeof PayloadKarsaRangkumanSchema>;
export type PayloadKarsaAdaptasiDialek = z.infer<typeof PayloadKarsaAdaptasiDialekSchema>;
export type PayloadKarsaTranslate = z.infer<typeof PayloadKarsaTranslateSchema>;
export type PayloadKarsaTerjemahanKalimat = z.infer<typeof PayloadKarsaTerjemahanKalimatSchema>;
export type PayloadKarsaTerjemahanDokumen = z.infer<typeof PayloadKarsaTerjemahanDokumenSchema>;
export type PayloadKarsaAnalisa = z.infer<typeof PayloadKarsaAnalisaSchema>;
export type PayloadKarsaAnalisaKalimat = z.infer<typeof PayloadKarsaAnalisaKalimatSchema>;
export type PayloadKarsaAnalisaDokumen = z.infer<typeof PayloadKarsaAnalisaDokumenSchema>;
export type PayloadSubmissionKarsa = z.infer<typeof PayloadSubmissionKarsaSchema>;
export type PayloadSubmissionReactionKarsa = z.infer<typeof PayloadSubmissionReactionKarsaSchema>;
