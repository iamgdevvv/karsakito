import type { ComboboxItem } from "@mantine/core";
import { type RouterContextProvider } from "react-router";
import { PayloadCreateKarsaAppSchema, PayloadQueryKarsaAppsSchema, PayloadUpdateKarsaAppSchema, type PayloadQueryKarsaApps } from "~app-modules/schema/app";
import { dayjs, qsParse, valueBooleanOrFalse } from "~app-modules/utils";
import { prismaClient } from "~app-server/context";
import { authMiddlewareSession } from "~app-server/session";
import { messageActionError, valueNullOrSkip, valueOrSkip } from "~app-server/utils";
import { Prisma, type KarsaApp } from "~generated/prisma/client";

export const actionCreateKarsaApp = async ({
    request,
    context
}: {
    request: Request
    context: Readonly<RouterContextProvider>
}) => {
    try {
        const authSession = await authMiddlewareSession({
            guard: {
                role: ['ADMIN', 'STAFF'],
            },
            request,
        });

        if ('error' in authSession) {
            return {
                error: 'Forbidden'
            }
        }

        const formData = await request.formData()
        const body = PayloadCreateKarsaAppSchema.parse(Object.fromEntries(formData))

        return {
            data: await prismaClient(context).karsaApp.create({
                data: body,
                select: {
                    name: true
                }
            })
        }
    } catch (error) {
        return {
            error: messageActionError(error)
        }
    }
};

export const actionUpdateKarsaApp = async ({
    request,
    context
}: {
    request: Request
    context: Readonly<RouterContextProvider>
}) => {
    try {
        const authSession = await authMiddlewareSession({
            guard: {
                role: ['ADMIN', 'STAFF'],
            },
            request,
        });

        if ('error' in authSession) {
            return {
                error: 'Forbidden'
            }
        }

        const formData = await request.formData()
        const body = PayloadUpdateKarsaAppSchema.parse(Object.fromEntries(formData))

        const resultKarsaApp = await prismaClient(context).karsaApp.update({
            where: {
                id: body.karsaAppId
            },
            data: {
                name: valueOrSkip(body.name),
                category: valueOrSkip(body.category),
                label: valueOrSkip(body.label),
                token: valueOrSkip(body.token),
                tokenPromo: valueNullOrSkip(body.tokenPromo),
                visible: valueBooleanOrFalse(body.visible),
            },
            select: {
                id: true
            }
        })

        return {
            data: resultKarsaApp
        }
    } catch (error) {

        return {
            error: messageActionError(error)
        }
    }
};


export const actionDeleteKarsaApp = async ({
    karsaAppId,
    request,
    context
}: {
    karsaAppId: string
    request: Request
    context: Readonly<RouterContextProvider>
}) => {
    try {
        const authSession = await authMiddlewareSession({
            guard: {
                role: ['ADMIN', 'STAFF'],
            },
            request,
        });

        if ('error' in authSession) {
            return {
                error: 'Forbidden'
            }
        }

        const resultKarsaApp = await prismaClient(context).karsaApp.delete({
            where: {
                id: karsaAppId
            },
            select: {
                name: true
            }
        })

        return {
            data: {
                name: `Delete karsaApp ${resultKarsaApp.name} successfully`
            }
        }
    } catch (error) {
        return {
            error: messageActionError(error)
        }
    }
};

export const actionGetKarsaApps = async <T = KarsaApp>({
    request,
    context
}: {
    request: Request
    context: Readonly<RouterContextProvider>
}): Promise<{
    data: T[];
    params: PayloadQueryKarsaApps | null;
    nextCursor: KarsaApp['id'] | null;
    previousCursor: KarsaApp['id'] | null;
}> => {
    try {
        const authSession = await authMiddlewareSession({
            guard: {
                role: ['ADMIN', 'STAFF'],
            },
            request,
        });

        if ('error' in authSession) {
            return {
                data: [],
                params: null,
                nextCursor: null,
                previousCursor: null,
            }
        }

        const searchPayload = qsParse(new URL(request.url).search);

        const queryParams = PayloadQueryKarsaAppsSchema.parse(searchPayload);

        const { nextCursor, previousCursor, total, search, asc, desc, select, ...params } = queryParams

        const argsOrderBy: Prisma.KarsaAppOrderByWithRelationInput[] = [];
        const argsSelect: Prisma.KarsaAppSelect = {};
        const whereSearch: Prisma.KarsaAppWhereInput['OR'] = []

        if (typeof desc === 'string') {
            argsOrderBy.push({
                [desc]: 'desc',
            });
        } else if (desc?.length) {
            desc.forEach((field) => {
                argsOrderBy.push({
                    [field]: 'desc',
                });
            });
        }

        if (typeof asc === 'string') {
            argsOrderBy.push({
                [asc]: 'asc',
            });
        } else if (asc?.length) {
            asc.forEach((field) => {
                argsOrderBy.push({
                    [field]: 'asc',
                });
            });
        }

        if (typeof select === 'string') {
            argsSelect[select] = true;
        } else if (select) {
            select.forEach((field) => {
                argsSelect[field] = true;
            });
        }

        if (search) {
            const searchFields = ['name', 'label', 'category'] satisfies Prisma.KarsaAppScalarFieldEnum[];

            whereSearch.push(...searchFields.map((field) => ({
                [field]: {
                    contains: search,
                }
            })));
        }

        const pageSize = Number(total || 10);
        const takeAmount = pageSize + 1;
        let cursorId = nextCursor;
        let isBackward = false;

        if (previousCursor) {
            isBackward = true;
            cursorId = previousCursor;
        }

        const args = {
            take: isBackward ? -takeAmount : takeAmount,
            skip: cursorId ? 1 : Prisma.skip,
            cursor: cursorId ? { id: cursorId } : Prisma.skip,
            orderBy: argsOrderBy.length ? argsOrderBy : Prisma.skip,
            ...(Object.keys(argsSelect).length ? { select: { ...argsSelect, id: true } } : {}),
            where: {
                OR: whereSearch.length ? whereSearch : Prisma.skip,
                id: valueOrSkip(params.id),
                name: valueOrSkip(params.name),
                label: valueOrSkip(params.label),
                token: valueOrSkip(params.token),
                tokenPromo: valueNullOrSkip(params.tokenPromo),
                visible: valueOrSkip(params.visible),
                category: valueOrSkip(params.category),
                createdAt: params.createdAt
                    ? {
                        lte: dayjs(params.createdAt).endOf('day').toDate(),
                        gte: dayjs(params.createdAt).startOf('day').toDate(),
                    }
                    : Prisma.skip,
                updatedAt: params.updatedAt
                    ? {
                        lte: dayjs(params.updatedAt).endOf('day').toDate(),
                        gte: dayjs(params.updatedAt).startOf('day').toDate(),
                    }
                    : Prisma.skip,
            }
        } as const satisfies Prisma.KarsaAppFindManyArgs

        const rawResultKarsaApps = await prismaClient(context).karsaApp.findMany(args)

        let hasExtraRecord = rawResultKarsaApps.length > pageSize;
        let resultKarsaApps = [...rawResultKarsaApps];

        let finalNextCursor: KarsaApp['id'] | null = null;
        let finalPrevCursor: KarsaApp['id'] | null = null;

        if (isBackward) {
            if (hasExtraRecord) {
                resultKarsaApps.shift();
                finalPrevCursor = resultKarsaApps[0]?.id || null;
            }

            if (resultKarsaApps.length > 0) {
                finalNextCursor = resultKarsaApps[resultKarsaApps.length - 1].id;
            }
        } else {
            if (hasExtraRecord) {
                resultKarsaApps.pop();
                finalNextCursor = resultKarsaApps[resultKarsaApps.length - 1]?.id || null;
            }

            if (cursorId && resultKarsaApps.length > 0) {
                finalPrevCursor = resultKarsaApps[0].id;
            }
        }

        return {
            data: resultKarsaApps as T[],
            params: queryParams,
            nextCursor: finalNextCursor,
            previousCursor: finalPrevCursor
        }
    } catch {
        return {
            data: [],
            params: null,
            nextCursor: null,
            previousCursor: null,
        }
    }
};

export const actionGetKarsaApp = async ({
    karsaAppId,
    request,
    context
}: {
    karsaAppId: KarsaApp['id']
    request: Request
    context: Readonly<RouterContextProvider>
}) => {
    try {
        const authSession = await authMiddlewareSession({
            guard: {
                role: ['ADMIN'],
            },
            request,
        });

        if ('error' in authSession) {
            return {
                error: 'Forbidden'
            }
        }

        return {
            data: await prismaClient(context).karsaApp.findUniqueOrThrow({
                where: {
                    id: karsaAppId
                }
            })
        }
    } catch (error) {
        return {
            error: messageActionError(error)
        }
    }
};

export const actionGetKarsaAppsByCategory = async ({
    context
}: {
    context: Readonly<RouterContextProvider>
}): Promise<Record<KarsaApp['category'], ComboboxItem[]>> => {
    const karsaAppWithCategories: Record<KarsaApp['category'], ComboboxItem[]> = {
        karsawriter: [],
        karsalator: [],
        karsalisa: [],
        karsafrase: [],
        karsapedia: []
    }
    try {
        const karsaApps = await prismaClient(context).karsaApp.findMany({
            orderBy: [
                {
                    category: 'asc'
                },
                {
                    label: 'asc'
                },
            ],
            select: {
                id: true,
                label: true,
                visible: true,
                category: true,
            },
        })

        karsaApps.forEach((app) => {
            karsaAppWithCategories[app.category].push({
                value: app.id,
                label: app.label,
                disabled: !app.visible,
            })
        })
    } catch (error) {
        console.log('actionGetKarsaAppsByCategory', error);
    }

    return karsaAppWithCategories
};

export type ActionCreateKarsaApp = Awaited<ReturnType<typeof actionCreateKarsaApp>>;
export type ActionUpdateKarsaApp = Awaited<ReturnType<typeof actionUpdateKarsaApp>>;
export type ActionDeleteKarsaApp = Awaited<ReturnType<typeof actionDeleteKarsaApp>>;