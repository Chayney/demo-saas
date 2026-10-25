
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

    const companyCount = 3;
    const customersPerCompany = 100;

    // 既存データを削除（子テーブルから順番に削除）
    await prisma.project.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();
    await prisma.company.deleteMany();

    // パスワードをハッシュ化
    const passwordHash = await hash("11111111", 10);

    const companyNames = [
        "株式会社サンプルA",
        "株式会社サンプルB",
        "株式会社サンプルC",
    ];

    const customerNames = [
        "株式会社アルファ",
        "株式会社ベータ",
        "株式会社ガンマ",
        "株式会社デルタ",
        "株式会社イプシロン",
        "株式会社ゼータ",
        "株式会社エータ",
        "株式会社シータ",
        "株式会社イオタ",
        "株式会社カッパ",
        "株式会社ラムダ",
        "株式会社ミュー",
        "株式会社ニュー",
        "株式会社クシー",
        "株式会社オミクロン",
        "株式会社パイ",
        "株式会社ロー",
        "株式会社シグマ",
        "株式会社タウ",
        "株式会社オメガ",
    ];

    const locations = [
        "東京都新宿区",
        "東京都渋谷区",
        "東京都港区",
        "東京都千代田区",
        "東京都中央区",
        "東京都品川区",
        "東京都世田谷区",
        "東京都豊島区",
        "神奈川県横浜市",
        "神奈川県川崎市",
        "埼玉県さいたま市",
        "千葉県千葉市",
        "大阪府大阪市",
        "京都府京都市",
        "愛知県名古屋市",
        "福岡県福岡市",
        "北海道札幌市",
        "宮城県仙台市",
        "兵庫県神戸市",
        "広島県広島市",
    ];

    const projectNames = [
        "コーポレートサイトリニューアル",
        "ECサイト構築",
        "顧客管理システム開発",
        "業務効率化ツール開発",
        "予約管理システム開発",
        "Webサイト制作",
        "業務管理システム開発",
        "社内システム刷新",
        "スマートフォンアプリ開発",
        "データ分析基盤構築",
        "勤怠管理システム開発",
        "在庫管理システム開発",
        "オンライン予約システム構築",
        "会員管理システム開発",
        "販売管理システム開発",
        "採用サイト制作",
        "ブランドサイト制作",
        "決済システム連携",
        "社内ポータルサイト構築",
        "業務自動化システム開発",
    ];

    const now = new Date();

    for (let companyIndex = 0; companyIndex < companyCount; companyIndex++) {
        const companyNumber = companyIndex + 1;
        const companySuffix = String(companyNumber).padStart(2, "0");

        // 会社を作成
        const company = await prisma.company.create({
            data: {
                name: companyNames[companyIndex],
                email: `company${companySuffix}@example.com`,
                password: passwordHash,
            },
        });

        console.log(`\nCompany created: ${company.name}`);

        // ユーザーを3人作成（管理者1人、一般2人）
        const users = [
            {
                name: `管理者${companySuffix}`,
                email: `admin${companySuffix}@example.com`,
                role: 1,
            },
            {
                name: `一般ユーザー${companySuffix}-1`,
                email: `user${companySuffix}01@example.com`,
                role: 2,
            },
            {
                name: `一般ユーザー${companySuffix}-2`,
                email: `user${companySuffix}02@example.com`,
                role: 2,
            },
        ];

        await prisma.user.createMany({
            data: users.map((user) => ({
                ...user,
                password: passwordHash,
                companyId: company.id,
            })),
        });

        // 各会社に顧客100件と案件100件を作成
        for (
            let customerIndex = 0;
            customerIndex < customersPerCompany;
            customerIndex++
        ) {
            const customerNumber = customerIndex + 1;
            const customerSuffix = String(customerNumber).padStart(3, "0");

            // 会社ごとに一意なメールアドレスを生成
            const emailPrefix = `c${companySuffix}customer${customerSuffix}`;

            // 過去90日以内の作成日時
            const daysAgo = Math.floor(Math.random() * 90);
            const createdAt = new Date(
                now.getTime() - daysAgo * 24 * 60 * 60 * 1000
            );

            // 顧客を作成
            const customer = await prisma.customer.create({
                data: {
                    name: `${customerNames[
                        customerIndex % customerNames.length
                        ]
                        } ${companySuffix}-${customerSuffix}`,
                    email: `${emailPrefix}@example.com`,
                    phone: `090-${String(
                        companyIndex * customersPerCompany +
                        customerIndex +
                        1000
                    ).padStart(4, "0")}-${String(
                        customerIndex + 1000
                    ).padStart(4, "0")}`,
                    address:
                        locations[
                        (companyIndex * customersPerCompany +
                            customerIndex) %
                        locations.length
                        ],
                    companyId: company.id,
                    createdAt,
                    updatedAt: createdAt,
                },
            });

            // 作成した顧客に案件を1件紐づける
            await prisma.project.create({
                data: {
                    name: `${projectNames[
                        customerIndex % projectNames.length
                        ]
                        } ${companySuffix}-${customerSuffix}`,
                    companyId: company.id,
                    customerId: customer.id,
                    createdAt,
                    updatedAt: createdAt,
                },
            });
        }

        console.log(
            `${company.name}: 3 users, ${customersPerCompany} customers, ${customersPerCompany} projects created`
        );
    }

    console.log("\nSeeding completed!");
    console.log("------------------------------");
    console.log(`Companies: ${companyCount}`);
    console.log(`Users: ${companyCount * 3}`);
    console.log(
        `  Administrators: ${companyCount}`
    );
    console.log(
        `  General users: ${companyCount * 2}`
    );
    console.log(
        `Customers: ${companyCount * customersPerCompany}`
    );
    console.log(
        `Projects: ${companyCount * customersPerCompany}`
    );
    console.log("------------------------------");
}

main()
    .catch((error) => {
        console.error("Seeding failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
