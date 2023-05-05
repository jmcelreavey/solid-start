import type { Member, Reward, TokenEconomy } from "@prisma/client";

export const MEMBERS: Omit<Member, "id" | "createdAt" | "updatedAt">[] = [
    {
        email: "john@mcelreavey.com",
        password: "password",
    },
];

export const TOKEN_ECONOMIES: Omit<TokenEconomy, "id" | "createdAt" | "updatedAt" | "memberId">[] =
    [
        {
            name: "Token Economy",
            tokens: 0,
        },
    ];

export const REWARDS: Omit<Reward, "id" | "createdAt" | "updatedAt" | "tokenEconomyId">[] = [
    {
        name: "Reward",
        tokens: 10,
        limit: null,
    },
];
