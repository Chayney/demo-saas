import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma-client";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log("Seeding database...");

    await prisma.todo.deleteMany();
    await prisma.user.deleteMany();

    const passwordOrg = await hash("11111111", 10);

    const user = await prisma.user.create({
        data: {
            name: "山田 太郎",
            email: "yamada@example.com",
            password: passwordOrg
        },
    });

    await prisma.todo.createMany({
        data: [
            {
                title: "Next.jsの環境構築をする",
                content: "勉強",
                userId: user.id,
            },
            {
                title: "Server ActionsでCRUDを実装する",
                content: "朝食",
                userId: user.id,
            },
        ],
    });

    console.log("Seeding completed!");
    console.log(`User: ${user.name}`);
    console.log(`User ID: ${user.id}`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
