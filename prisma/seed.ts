import { db } from "~/db";
import { MEMBERS, REWARDS, TOKEN_ECONOMIES } from "./const";

const main = async () => {
    for (const member of MEMBERS) {
        const uniqueMemberId = member.email;
        const upsertMember = await db.member.upsert({
            where: {
                email: member.email,
            },
            create: {
                ...member,
                id: uniqueMemberId,
            },
            update: {
                ...member,
                id: uniqueMemberId,
            },
        });

        for (const tokenEconomy of TOKEN_ECONOMIES) {
            const uniqueTokenEconomyId = upsertMember.id + tokenEconomy.name;
            const upsertTokenEconomy = await db.tokenEconomy.upsert({
                where: {
                    id: uniqueTokenEconomyId,
                },
                create: {
                    ...tokenEconomy,
                    Member: { connect: { id: upsertMember.id } },
                    id: uniqueTokenEconomyId,
                },
                update: {
                    ...tokenEconomy,
                    Member: { connect: { id: upsertMember.id } },
                    id: uniqueTokenEconomyId,
                },
            });

            for (const reward of REWARDS) {
                const uniqueRewardId = upsertTokenEconomy.id + reward.name;
                const upsertReward = await db.reward.upsert({
                    where: {
                        id: uniqueRewardId,
                    },
                    create: {
                        ...reward,
                        TokenEconomy: { connect: { id: upsertTokenEconomy.id } },
                        id: uniqueRewardId,
                    },
                    update: {
                        ...reward,
                        TokenEconomy: { connect: { id: upsertTokenEconomy.id } },
                        id: uniqueRewardId,
                    },
                });

                const unqiueRewardHistoryId = uniqueRewardId;
                await db.rewardHistory.upsert({
                    where: {
                        id: unqiueRewardHistoryId,
                    },
                    create: {
                        Reward: {
                            connect: { id: upsertReward.id },
                        },
                        Member: { connect: { id: upsertMember.id } },
                        id: unqiueRewardHistoryId,
                    },
                    update: {
                        Reward: {
                            connect: { id: upsertReward.id },
                        },
                        Member: { connect: { id: upsertMember.id } },
                        id: unqiueRewardHistoryId,
                    },
                });
            }
        }
    }
};

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
