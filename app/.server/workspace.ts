import { type RouterContextProvider } from "react-router";
import { uuidv7 } from "uuidv7";
import { PayloadSubmissionKarsaSchema, type KarsaPlain } from "~app-modules/schema/karsa";
import { cfContext, prismaClient } from "~app-server/context";
import { authMiddlewareSession } from "~app-server/session";
import { messageActionError, valueOrSkip } from "~app-server/utils";
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

const submissionKarsaAI = async (apiUrl: string, payload: NonNullable<KarsaPlain['promptJson']>) => {
    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(payload),
        })

        const data = await res.json() as {
            result: string
        }

        return data.result
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
}) => {
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
        const body = PayloadSubmissionKarsaSchema.parse(Object.fromEntries(formData))

        const prisma = prismaClient(context);

        const [karsaApp, userBallance] = await prisma.$transaction([
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
        const userTotalToken = userBallance.tokenDaily + userBallance.token

        if (userTotalToken < karsaAppCostToken) {
            throw new Error("Insufficient tokens to perform this action.");
        }

        const result = await submissionKarsaAI(cfContext(context).env.API_AI_URL + karsaAIEndpoint[body.app], body.payload)

        if (!result) {
            return {
                error: 'Failed to generate karsa'
            }
        }

        const karsaId = uuidv7();

        const payloadKarsa: Prisma.KarsaUncheckedCreateWithoutBalanceActivityInput = {
            id: karsaId,
            app: body.app,
            promptJson: body.payload,
            result,
            userId: authSession.user.id,
            workspaceWindow: {
                connectOrCreate: {
                    where: {
                        id: body.windowWorkspace.id
                    },
                    create: {
                        title: body.windowWorkspace.title,
                        props: body.windowWorkspace.props || Prisma.skip,
                        workspace: {
                            connectOrCreate: {
                                where: {
                                    id: valueOrSkip(body.workspaceId)
                                },
                                create: {
                                    title: 'My Workspace',
                                    userId: authSession.user.id
                                }
                            }
                        }
                    }
                }
            }
        }

        let newTokenRegular = userBallance.token;
        let newTokenDaily = userBallance.tokenDaily;

        if (userBallance.tokenDaily >= karsaAppCostToken) {
            // Daily tokens are enough to cover the whole cost
            newTokenDaily = userBallance.tokenDaily - karsaAppCostToken;
        } else {
            // Daily tokens aren't enough, drain them and take the rest from regular tokens
            const remainingCost = karsaAppCostToken - userBallance.tokenDaily;
            newTokenRegular = userBallance.token - remainingCost;
            newTokenDaily = 0;
        }

        try {
            await prisma.balance.update({
                where: {
                    userId: authSession.user.id,
                    // Optimistic concurrency check (ensures balance hasn't changed between read and update)
                    token: userBallance.token,
                    tokenDaily: userBallance.tokenDaily
                },
                data: {
                    token: newTokenRegular,
                    tokenDaily: newTokenDaily,
                    activities: {
                        create: {
                            type: 'KARSA',
                            token: karsaAppCostToken,
                            tokenBefore: userBallance.token,
                            tokenAfter: newTokenRegular,
                            tokenDailyBefore: userBallance.tokenDaily,
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
                karsaId
            }
        }
    } catch (error) {
        console.log('actionCreateKarsaApp', error)

        return {
            error: messageActionError(error)
        }
    }
};

export type ActionSubmissionKarsaAI = Awaited<ReturnType<typeof actionSubmissionKarsaAI>>;