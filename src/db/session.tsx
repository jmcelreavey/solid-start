import { PrismaClient } from "@prisma/client";
import { redirect } from "solid-start/server";
import { createCookieSessionStorage } from "solid-start/session";
import { db } from ".";
type LoginForm = {
    email: string;
    password: string;
};

export async function register({ email, password }: LoginForm) {
    return db.member.create({
        data: { email, password },
    });
}

export async function login({ email, password }: LoginForm) {
    const member = await db.member.findUnique({ where: { email } });
    if (!member) return null;
    const isCorrectPassword = password === member.password;
    if (!isCorrectPassword) return null;
    return member;
}

export async function dupeCheck({ email = "" }) {
    const member = await db.member.findUnique({ where: { email } });
    return Boolean(member);
}

const sessionSecret = import.meta.env.SESSION_SECRET;

const storage = createCookieSessionStorage({
    cookie: {
        name: "RJ_session",
        // secure doesn't work on localhost for Safari
        // https://web.dev/when-to-use-local-https/
        secure: true,
        secrets: ["hello"],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
});

export function getMemberSession(request: Request) {
    return storage.getSession(request.headers.get("Cookie"));
}

export async function getMemberId(request: Request) {
    const session = await getMemberSession(request);
    const memberId = session.get("memberId");
    if (!memberId || typeof memberId !== "string") return null;
    return memberId;
}

export async function requireEmailId(
    request: Request,
    redirectTo: string = new URL(request.url).pathname
) {
    const session = await getMemberSession(request);
    const memberId = session.get("memberId");
    if (!memberId || typeof memberId !== "string") {
        const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
        throw redirect(`/login?${searchParams}`);
    }
    return memberId;
}

export async function getMember(db: PrismaClient, request: Request) {
    const memberId = await getMemberId(request);
    if (typeof memberId !== "string") {
        return null;
    }

    try {
        const member = await db.member.findUnique({ where: { id: memberId } });
        return member;
    } catch {
        throw logout(request);
    }
}

export async function logout(request: Request) {
    const session = await storage.getSession(request.headers.get("Cookie"));
    return redirect("/login", {
        headers: {
            "Set-Cookie": await storage.destroySession(session),
        },
    });
}

export async function createMemberSession(memberId: string, redirectTo: string) {
    const session = await storage.getSession();
    session.set("memberId", memberId);
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session),
        },
    });
}
