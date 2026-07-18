import { type RouterContextProvider } from 'react-router';
import { uuidv7 } from 'uuidv7';
import {
    PayloadSubmissionKarsaSchema,
    PayloadSubmissionReactionKarsaSchema,
    type KarsaPlain,
    type PayloadKarsaAnalisa,
    type PayloadKarsaTranslate,
    type PayloadSubmissionReactionKarsa,
} from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import { parseFormData } from '~app-modules/utils';
import { cfContext, prismaClient } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import { messageActionError } from '~app-server/utils';
import { Prisma } from '~generated/prisma/client';

const karsaAIEndpoint = {
	pidato: '/karsawriter/pidato',
	pantun: '/karsawriter/pantun',
	syair: '/karsawriter/syair',
	puisi: '/karsawriter/puisi',
	hymne: '/karsawriter/hymne',
	ceritapendek: '/karsawriter/ceritapendek',
	ceritapanjang: '/karsawriter/ceritapanjang',
	doabersama: '/karsawriter/doabersama',
	petuah: '/karsawriter/petuah',
	tagline: '/karsawriter/tagline',
	slogan: '/karsawriter/slogan',
	motto: '/karsawriter/motto',
	tekateki: '/karsawriter/tekateki',
	parafrase: '/karsafrasa/parafrasa',
	adaptasidialek: '/karsafrasa/adaptasidialek',
	rangkuman: '/karsafrasa/rangkuman',
	analisakalimat: '/karsalisa/analyze',
	analisadokumen: '/karsalisa/analyze',
	terjemahankalimat: '/karsalator/translate',
	terjemahandokumen: '/karsalator/translate',
	peribahasa: '/karsapedia/peribahasa',
	adatistiadat: '/karsapedia/adatistiadat',
	sejarah: '/karsapedia/sejarah',
	artefak: '/karsapedia/artefak',
} as const satisfies Record<KarsaPlain['app'], `/${string}`>;

const submissionKarsaAI = async (
	apiUrl: string,
	payload: NonNullable<KarsaPlain['promptJson']>,
	metadata: Pick<RequestInit, 'headers'> & {
		Authorization: string;
	},
) => {
	try {
		const res = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				...metadata.headers,
				Authorization: metadata.Authorization,
				accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		});

		const data = (await res.json()) as
			| {
					result: string;
			  }
			| {
					detail: [
						{
							type: string | 'model_attributes_type';
							loc: unknown[];
							msg: string;
							input: `{${string}}`;
						},
					];
			  };

		console.log({
			apiUrl,
			payload,
			response: JSON.stringify(data, null, 2),
		});

		if ('result' in data) {
			return data.result;
		}

		return null;
	} catch (error) {
		console.log('submissionKarsaAI', error);

		return null;
	}
};

export const actionSubmissionKarsaAI = async ({
	request,
	context,
}: {
	request: Request;
	context: Readonly<RouterContextProvider>;
}): Promise<
	| {
			data: NonNullable<PayloadWindowWorkspace['karsa']>;
	  }
	| {
			error: string;
	  }
> => {
	try {
		const authSession = await authMiddlewareSession({
			request,
		});

		if ('error' in authSession) {
			return {
				error: 'Anda tidak memiliki akses untuk tindakan ini.',
			};
		}

		const formData = await request.formData();
		const formBody = formData.get('body');

		if (!formBody) {
			return {
				error: 'Permintaan tidak valid.',
			};
		}

		const payload = JSON.parse(formBody.toString());
		const body = PayloadSubmissionKarsaSchema.parse(payload);

		const prisma = prismaClient(context);
		const cfEnv = cfContext(context).env;

		const [karsaApp, userBalance] = await prisma.$transaction([
			prisma.karsaApp.findUniqueOrThrow({
				where: {
					name: body.app,
					visible: true,
				},
				select: {
					token: true,
					tokenPromo: true,
				},
			}),
			prisma.balance.findUniqueOrThrow({
				where: {
					userId: authSession.user.id,
				},
				select: {
					token: true,
					tokenDaily: true,
				},
			}),
		]);

		const karsaAppCostToken = karsaApp.tokenPromo || karsaApp.token;
		const userTotalToken = userBalance.tokenDaily + userBalance.token;

		if (userTotalToken < karsaAppCostToken) {
			return {
				error: 'Token Anda tidak mencukupi untuk menggunakan fitur ini.',
			};
		}

		let submissionPayload: KarsaPlain['promptJson'] = body.payload;

		if (body.app === 'terjemahankalimat') {
			submissionPayload = {
				source_language: body.payload.sourceLanguage,
				target_language: body.payload.targetLanguage,
				info: `Nuansa penggunaan ${body.payload.usage}`,
				text: body.payload.text,
			} satisfies PayloadKarsaTranslate;
		} else if (body.app === 'terjemahandokumen') {
			submissionPayload = {
				source_language: body.payload.sourceLanguage,
				target_language: body.payload.targetLanguage,
				info: body.payload.info,
				text: body.payload.selectionText,
			} satisfies PayloadKarsaTranslate;
		} else if (body.app === 'analisakalimat') {
			submissionPayload = {
				language: body.payload.language,
				info: '',
				audience: body.payload.audience,
				text: body.payload.text,
			} satisfies PayloadKarsaAnalisa;
		} else if (body.app === 'analisadokumen') {
			submissionPayload = {
				language: body.payload.language,
				info: body.payload.info,
				audience: body.payload.audience,
				text: body.payload.selectionText,
			} satisfies PayloadKarsaAnalisa;
		}

		const result = await submissionKarsaAI(
			cfEnv.API_AI_URL + karsaAIEndpoint[body.app],
			{
				...submissionPayload,
				userId: authSession.user.id,
			},
			{
				Authorization: `Bearer ${cfEnv.API_AI_KEY}`,
			},
		);

		if (!result) {
			return {
				error: 'Hasil belum dapat dibuat. Silakan coba lagi.',
			};
		}

		const payloadKarsa = {
			id: uuidv7(),
			app: body.app,
			promptJson: body.payload,
			result,
			userId: authSession.user.id,
			workspaceWindow: body.windowWorkspaceId
				? {
						connect: {
							id: body.windowWorkspaceId,
						},
					}
				: Prisma.skip,
		} satisfies Prisma.KarsaUncheckedCreateWithoutBalanceActivityInput;

		let newTokenRegular = userBalance.token;
		let newTokenDaily = userBalance.tokenDaily;

		if (userBalance.tokenDaily >= karsaAppCostToken) {
			// Daily tokens are enough to cover the whole cost
			newTokenDaily = userBalance.tokenDaily - karsaAppCostToken;
		} else {
			// Daily tokens aren't enough, drain them and take the rest from regular tokens
			const remainingCost = karsaAppCostToken - userBalance.tokenDaily;
			newTokenRegular = userBalance.token - remainingCost;
			newTokenDaily = 0;
		}

		try {
			await prisma.balance.update({
				where: {
					userId: authSession.user.id,
					// Optimistic concurrency check (ensures balance hasn't changed between read and update)
					token: userBalance.token,
					tokenDaily: userBalance.tokenDaily,
				},
				data: {
					token: newTokenRegular,
					tokenDaily: newTokenDaily,
					activities: {
						create: {
							type: 'KARSA',
							token: karsaAppCostToken,
							tokenBefore: userBalance.token,
							tokenAfter: newTokenRegular,
							tokenDailyBefore: userBalance.tokenDaily,
							tokenDailyAfter: newTokenDaily,
							karsa: {
								create: payloadKarsa,
							},
						},
					},
				},
				select: {
					userId: true,
				},
			});
		} catch (error) {
			console.log('Concurrency or DB Error while saving:', error);

			return {
				error: 'Hasil belum dapat disimpan karena saldo Token berubah. Silakan coba lagi.',
			};
		}

		return {
			data: {
				id: payloadKarsa.id,
				promptJson: payloadKarsa.promptJson,
				result,
			},
		};
	} catch (error) {
		console.log('actionSubmissionKarsaAI', error);

		return {
			error: messageActionError(error),
		};
	}
};

export const actionSubmissionReactionKarsaAI = async ({
	request,
	context,
}: {
	request: Request;
	context: Readonly<RouterContextProvider>;
}): Promise<
	| {
			data: Pick<PayloadSubmissionReactionKarsa, 'feedback' | 'reaction'>;
	  }
	| {
			error: string;
	  }
> => {
	try {
		const authSession = await authMiddlewareSession({
			request,
		});

		if ('error' in authSession) {
			return {
				error: 'Anda tidak memiliki akses untuk tindakan ini.',
			};
		}

		const formData = await request.formData();
		const { karsaId, ...body } = PayloadSubmissionReactionKarsaSchema.parse(
			parseFormData(formData),
		);

		await prismaClient(context).karsa.update({
			where: {
				id: karsaId,
			},
			data: body,
			select: {
				app: true,
			},
		});

		return {
			data: body,
		};
	} catch (error) {
		console.log('actionSubmissionReactionKarsaAI', error);

		return {
			error: messageActionError(error),
		};
	}
};

export type ActionSubmissionKarsaAI = Awaited<
	ReturnType<typeof actionSubmissionKarsaAI>
>;
export type ActionSubmissionReactionKarsaAI  = Awaited<
    ReturnType<typeof actionSubmissionReactionKarsaAI>
>;
