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

const authGetSession = async (request: Request) => await getSession(request.headers.get('Cookie'))

const authMiddlewareSession = async ({
    guard,
    request,
}: {
    guard?: {
        userId?: string
        role?: UserRole[],
    }
    request: Request
}) => {
    const authUser = await authGetSession(request);
    const user = authUser.get('user')

    if (!user) {
        return false
    }

    if (!user.isActive) {
        return false
    }

    if (guard) {
        if (guard.userId && guard.userId !== user.id) {
            return false
        }

        if (guard.role && !guard.role.includes(user.role)) {
            return false
        }
    }

    return user;
};


export { authGetSession, authLoginSession, authLogoutSession, authMiddlewareSession };

