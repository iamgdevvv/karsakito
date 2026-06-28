import { redirect, type RouterContextProvider } from "react-router";
import { PayloadLoginSchema, PayloadRegisterSchema } from "~app-modules/schema/auth";
import { prismaCtx } from "~app-server/context";
import { authGetSession, authLoginSession } from "~app-server/session";
import { Prisma } from "~generated/prisma/client";
import { hashCreds, verifyCreds } from "./utils";

export const actionFormLogin = async ({
    formData,
    request,
    context
}: {
    formData: FormData
    request: Request
    context: Readonly<RouterContextProvider>
}) => {
    const body = PayloadLoginSchema.safeParse(Object.fromEntries(formData))

    if (!body.data) {
        return {
            error: 'Credentials invalid'
        }
    }

    const { password, _redirect, ...payload } = body.data;

    const recordUser = await prismaCtx(context).user.findUnique({
        where: {
            email: payload.email
        },
        include: {
            auth: {
                select: {
                    hash: true
                }
            }
        }
    });

    if (!recordUser) {
        return {
            error: 'User not found'
        }
    }

    const { auth, ...user } = recordUser

    if (!user.isActive) {
        return {
            error: 'User not active'
        }
    }

    if (!auth) {
        return {
            error: 'User oauth without password'
        }
    }

    const credValid = await verifyCreds(password, auth.hash);

    if (!credValid) {
        return {
            error: 'Password incorrect'
        }
    }

    const authSession = await authGetSession(request);

    authSession.set('user', user);

    return redirect(_redirect || '/apps', {
        headers: {
            'Set-Cookie': await authLoginSession(authSession),
        },
    });
};

export const actionFormRegister = async ({
    formData,
    context
}: {
    formData: FormData
    context: Readonly<RouterContextProvider>
}) => {
    const body = PayloadRegisterSchema.safeParse(Object.fromEntries(formData))

    if (!body.data) {
        return {
            error: 'Credentials invalid'
        }
    }

    const { password, ...payload } = body.data;

    const hash = await hashCreds(password);

    try {
        const resultUser = await prismaCtx(context).user.create({
            data: {
                ...payload,
                auth: {
                    create: {
                        hash
                    }
                }
            },
            select: {
                id: true
            }
        })

        return {
            data: resultUser
        }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return {
                    error: 'Email already in use'
                }
            }
        }
    }
};

export type ActionFormLogin = Awaited<ReturnType<typeof actionFormLogin>>;
export type ActionFormRegister = Awaited<ReturnType<typeof actionFormRegister>>;