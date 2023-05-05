import { PrismaClient } from "@prisma/client";
import { createServerData$, redirect } from "solid-start/server";
import { getMember } from "./session";

export const useMember = () =>
    createServerData$(async (_, { request }) => {
        const db = new PrismaClient();
        const member = await getMember(db, request);

        if (!member) {
            throw redirect("/login");
        }

        return member;
    });
