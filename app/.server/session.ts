import { createWorkersKVSessionStorage } from "@react-router/cloudflare";
import { env } from "cloudflare:workers";
import { createCookie } from "react-router";
import type { User } from "~generated/prisma/client";
import type { UserRole } from "~generated/prisma/enums";

const {
    getSession,
    commitSession: authLoginSession,
    destroySession: authLogoutSession,
} = createWorkersKVSessionStorage<{
    user: User
}>({
    kv: env.SESSION,
    cookie: createCookie("__session", {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secrets: [env.SESSION_SECRET],
        secure: true,
    }),
});

const authGetSession = (request: Request) => getSession(request.headers.get('Cookie'))

export type AuthMiddlewareError = {
    error: true
    cause: 'user_not_found' | 'user_not_active' | 'user_not_authorized' | 'user_not_authorized_role'
}

const authMiddlewareSession = async ({
    guard,
    request,
}: {
    guard?: {
        userId?: string
        role?: UserRole[],
    }
    request: Request
}): Promise<{
    user: User
} | AuthMiddlewareError> => {
    try {
        const authUser = await authGetSession(request);
        const user = authUser.get('user')

        if (!user) {
            return {
                error: true,
                cause: 'user_not_found'
            }
        }

        if (!user.isActive) {
            return {
                error: true,
                cause: 'user_not_active'
            }
        }

        if (guard) {
            if (guard.userId && guard.userId !== user.id) {
                return {
                    error: true,
                    cause: 'user_not_authorized'
                }
            }

            if (guard.role && !guard.role.includes(user.role)) {
                return {
                    error: true,
                    cause: 'user_not_authorized_role'
                }
            }
        }

        return {
            user
        };
    } catch (error) {
        console.log('authMiddlewareSession', error)

        return {
            error: true,
            cause: 'user_not_authorized'
        }

    }
};


export { authGetSession, authLoginSession, authLogoutSession, authMiddlewareSession };

