import * as z from 'zod';
import { LanguageAppSchema } from '~app-modules/schema/app';
import { KarsaSchema, WorkspaceWindowSchema } from '~generated/prisma-zod/schemas/models';

export const karasInputMaxLength = {
	short: 200,
	prompt: 500,
	text: 1_000,
} as const;

const zKarsaString = (maxLength: number) =>
	z
		.string()
		.nonempty()
		.max(maxLength, `Maksimal ${maxLength.toLocaleString('id-ID')} karakter`);

export const KarsaSchemaPlain = KarsaSchema.omit({
	promptJson: true,
}).extend({
	promptJson: z.record(z.string(), z.unknown()).optional(),
});

export const PayloadKarsaPidatoSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	purpose: zKarsaString(karasInputMaxLength.short),
	agenda: zKarsaString(karasInputMaxLength.short),
	speaker: zKarsaString(karasInputMaxLength.short),
	audience: zKarsaString(karasInputMaxLength.short),
	topic: zKarsaString(karasInputMaxLength.prompt),
	totalSentence: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaPantunSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	type: zKarsaString(karasInputMaxLength.short),
	audience: zKarsaString(karasInputMaxLength.short),
	topic: zKarsaString(karasInputMaxLength.prompt),
	numberVerses: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaSyairSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	type: zKarsaString(karasInputMaxLength.short),
	audience: zKarsaString(karasInputMaxLength.short),
	tone: zKarsaString(karasInputMaxLength.short),
	topic: zKarsaString(karasInputMaxLength.prompt),
	numberVerses: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaPuisiSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	type: zKarsaString(karasInputMaxLength.short),
	audience: zKarsaString(karasInputMaxLength.short),
	style: zKarsaString(karasInputMaxLength.short),
	effect: zKarsaString(karasInputMaxLength.short),
	topic: zKarsaString(karasInputMaxLength.prompt),
	numberVerses: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaHymneSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	type: zKarsaString(karasInputMaxLength.short),
	institution: zKarsaString(karasInputMaxLength.short),
	structure: zKarsaString(karasInputMaxLength.short),
	topic: zKarsaString(karasInputMaxLength.prompt),
	numberVerses: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaPetuahSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	style: zKarsaString(karasInputMaxLength.short),
	topic: zKarsaString(karasInputMaxLength.prompt),
});

export const PayloadKarsaTaglineSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	entity: zKarsaString(karasInputMaxLength.short),
	usp: zKarsaString(karasInputMaxLength.short),
	audience: zKarsaString(karasInputMaxLength.short),
	tone: zKarsaString(karasInputMaxLength.short),
	wordLength: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaSloganSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	campaign: zKarsaString(karasInputMaxLength.short),
	audience: zKarsaString(karasInputMaxLength.short),
	tone: zKarsaString(karasInputMaxLength.short),
	wordLength: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaMottoSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	entity: zKarsaString(karasInputMaxLength.short),
	core_value: zKarsaString(karasInputMaxLength.short),
	tone: zKarsaString(karasInputMaxLength.short),
	wordLength: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaCeritaPendekSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	genre: zKarsaString(karasInputMaxLength.short),
	audience: zKarsaString(karasInputMaxLength.short),
	morale: zKarsaString(karasInputMaxLength.short),
	topic: zKarsaString(karasInputMaxLength.prompt),
	totalParagraphs: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaCeritaPanjangSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	genre: zKarsaString(karasInputMaxLength.short),
	audience: zKarsaString(karasInputMaxLength.short),
	morale: zKarsaString(karasInputMaxLength.short),
	topic: zKarsaString(karasInputMaxLength.prompt),
	totalParagraphs: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaDoaBersamaSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	religion: zKarsaString(karasInputMaxLength.short),
	topic: zKarsaString(karasInputMaxLength.prompt),
	totalSentence: z.number().gt(0).nonnegative(),
});

export const PayloadKarsaTekaTekiSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	type: zKarsaString(karasInputMaxLength.short),
	level: zKarsaString(karasInputMaxLength.short),
	topic: zKarsaString(karasInputMaxLength.prompt),
});

export const PayloadKarsaParafraseSchema = z.object({
	sourceLanguage: LanguageAppSchema.default('indonesia'),
	targetLanguage: LanguageAppSchema.default('indonesia'),
	preference: zKarsaString(karasInputMaxLength.short),
	text: zKarsaString(karasInputMaxLength.text),
});

export const PayloadKarsaRangkumanSchema = z.object({
	sourceLanguage: LanguageAppSchema.default('indonesia'),
	targetLanguage: LanguageAppSchema.default('indonesia'),
	style: zKarsaString(karasInputMaxLength.short),
	preference: zKarsaString(karasInputMaxLength.short),
	text: zKarsaString(karasInputMaxLength.text),
});

export const PayloadKarsaAdaptasiDialekSchema = z.object({
	sourceLanguage: LanguageAppSchema.default('indonesia'),
	targetLanguage: LanguageAppSchema.default('indonesia'),
	dialect: zKarsaString(karasInputMaxLength.short),
	text: zKarsaString(karasInputMaxLength.text),
});

export const PayloadKarsaTranslateSchema = z.object({
	source_language: LanguageAppSchema.default('indonesia'),
	target_language: LanguageAppSchema.default('minang'),
	info: zKarsaString(karasInputMaxLength.short),
	text: zKarsaString(karasInputMaxLength.text),
});

export const PayloadKarsaTerjemahanKalimatSchema = z.object({
	sourceLanguage: LanguageAppSchema.default('indonesia'),
	targetLanguage: LanguageAppSchema.default('minang'),
	usage: zKarsaString(karasInputMaxLength.short),
	text: zKarsaString(karasInputMaxLength.text),
});

export const PayloadKarsaTerjemahanDokumenSchema = z.object({
	sourceLanguage: LanguageAppSchema.default('indonesia'),
	targetLanguage: LanguageAppSchema.default('minang'),
	info: zKarsaString(karasInputMaxLength.short),
	selectionText: zKarsaString(karasInputMaxLength.text),
});

export const PayloadKarsaAnalisaSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	info: zKarsaString(karasInputMaxLength.short),
	audience: zKarsaString(karasInputMaxLength.short),
	text: zKarsaString(karasInputMaxLength.text),
});

export const PayloadKarsaAnalisaKalimatSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	audience: zKarsaString(karasInputMaxLength.short),
	text: zKarsaString(karasInputMaxLength.text),
});

export const PayloadKarsaAnalisaDokumenSchema = z.object({
	language: LanguageAppSchema.default('indonesia'),
	info: zKarsaString(karasInputMaxLength.short),
	audience: zKarsaString(karasInputMaxLength.short),
	selectionText: zKarsaString(karasInputMaxLength.text),
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
