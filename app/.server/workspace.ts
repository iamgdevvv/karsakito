import { type RouterContextProvider } from "react-router";
import { uuidv7 } from "uuidv7";
import { PayloadSubmissionKarsaSchema, type KarsaPlain } from "~app-modules/schema/karsa";
import type { PayloadWindowWorkspace } from "~app-modules/schema/workspace";
import { cfContext, prismaClient } from "~app-server/context";
import { authMiddlewareSession } from "~app-server/session";
import { messageActionError } from "~app-server/utils";
import { Prisma } from "~generated/prisma/client";

const karsaAIEndpoint = {
    pidato: "/karsawriter/pidato",
    pantun: "/karsawriter/pantun",
    syair: "/karsawriter/syair",
    puisi: "/karsawriter/puisi",
    hymne: "/karsawriter/hymne",
    ceritapendek: "/karsawriter/ceritapendek",
    ceritapanjang: "/karsawriter/ceritapanjang",
    doabersama: "/karsawriter/doabersama",
    petuah: "/karsawriter/petuah",
    tagline: "/karsawriter/tagline",
    slogan: "/karsawriter/slogan",
    motto: "/karsawriter/motto",
    tekateki: "/karsawriter/tekateki",
    parafrase: "/karsafrasa/parafrasa",
    adaptasidialek: "/karsafrasa/adaptasidialek",
    rangkuman: "/karsafrasa/rangkuman",
    analisakalimat: "/karsalisa/analyze",
    analisadokumen: "/karsalisa/analyze",
    terjemahankalimat: "/karsalator/translate",
    terjemahandokumen: "/karsalator/translate",
    peribahasa: "/karsapedia/peribahasa",
    adatistiadat: "/karsapedia/adatistiadat",
    sejarah: "/karsapedia/sejarah",
    artefak: "/karsapedia/artefak"
} as const satisfies Record<KarsaPlain['app'], `/${string}`>

const submissionKarsaAI = async (apiUrl: string, payload: NonNullable<KarsaPlain['promptJson']>, metadata: Pick<RequestInit, 'headers'> & {
    Authorization: string
}) => {
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
        })

        const data = await res.json() as {
            result: string
        } | {
            detail: [
                {
                    type: string | 'model_attributes_type',
                    loc: unknown[],
                    msg: string,
                    input: `{${string}}`
                }
            ]
        }

        if ('result' in data) {
            return data.result
        }

        return null
    } catch (error) {
        console.log('submissionKarsaAI', error)

        return null
    }
}

export const actionSubmissionKarsaAI = async ({
    request,
    context
}: {
    request: Request
    context: Readonly<RouterContextProvider>
}): Promise<{
    data: NonNullable<PayloadWindowWorkspace['karsa']>
} | {
    error: string
}> => {
    try {
        const authSession = await authMiddlewareSession({
            request,
        });

        if ('error' in authSession) {
            return {
                error: 'Forbidden'
            }
        }

        const formData = await request.formData()
        const formBody = formData.get('body')

        if (!formBody) {
            return {
                error: 'Bad Request'
            }
        }

        const payload = JSON.parse(formBody.toString())
        const body = PayloadSubmissionKarsaSchema.parse(payload)

        const prisma = prismaClient(context);
        const cfEnv = cfContext(context).env;

        const [karsaApp, userBalance] = await prisma.$transaction([
            prisma.karsaApp.findUniqueOrThrow({
                where: {
                    name: body.app,
                    visible: true
                },
                select: {
                    token: true,
                    tokenPromo: true,
                }
            }),
            prisma.balance.findUniqueOrThrow({
                where: {
                    userId: authSession.user.id
                },
                select: {
                    token: true,
                    tokenDaily: true
                }
            })
        ])

        const karsaAppCostToken = karsaApp.tokenPromo ?? karsaApp.token
        const userTotalToken = userBalance.tokenDaily + userBalance.token

        if (userTotalToken < karsaAppCostToken) {
            throw new Error("Insufficient tokens to perform this action.");
        }

        const result = await submissionKarsaAI(cfEnv.API_AI_URL + karsaAIEndpoint[body.app], body.payload, {
            Authorization: `Bearer ${cfEnv.API_AI_KEY}`,
        })

        if (!result) {
            return {
                error: 'Failed to generate karsa'
            }
        }

        const payloadKarsa = {
            id: uuidv7(),
            app: body.app,
            promptJson: body.payload,
            result,
            userId: authSession.user.id,
            workspaceWindow: body.windowWorkspaceId ? {
                connect: {
                    id: body.windowWorkspaceId
                }
            } : Prisma.skip
        } satisfies Prisma.KarsaUncheckedCreateWithoutBalanceActivityInput

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
                    tokenDaily: userBalance.tokenDaily
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
                                create: payloadKarsa
                            }
                        }
                    }
                },
                select: {
                    userId: true
                }
            })
        } catch (error) {
            console.log("Concurrency or DB Error while saving:", error);

            return {
                error: "Failed to save result due to a balance sync issue. Please try again."
            };
        }

        return {
            data: {
                id: payloadKarsa.id,
                promptJson: payloadKarsa.promptJson,
                result
            }
        }
    } catch (error) {
        console.log('actionSubmissionKarsaAI', error)

        return {
            error: messageActionError(error)
        }
    }
};

export type ActionSubmissionKarsaAI = Awaited<ReturnType<typeof actionSubmissionKarsaAI>>;