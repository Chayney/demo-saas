"use server";

import { auth } from "@/config/auth";
import { prisma } from "@/external/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ログインユーザーの会社IDを取得
const getCompanyId = async (): Promise<number> => {
    const session = await auth();

    if (!session?.user?.id || !session.user.companyId) {
        throw new Error("ログインが必要です");
    }

    return session.user.companyId;
};

// 顧客一覧を取得（検索・ページネーション対応）
export const getCustomers = async ({
    page = 1,
    query = "",
}: {
    page?: number;
    query?: string;
    } = {}) => {
    // 開発環境でのエラー画面テスト用（一時的に追加）
    // if (process.env.NODE_ENV === "development") {
    //     throw new Error("顧客一覧のエラー画面テスト");
    // }
    const companyId = await getCompanyId();

    const pageSize = 10;
    const keyword = query.trim().slice(0, 100);

    const where = {
        companyId,
        ...(keyword
            ? {
                OR: [
                    {
                        name: {
                            contains: keyword,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        email: {
                            contains: keyword,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        phone: {
                            contains: keyword,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        address: {
                            contains: keyword,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }
            : {}),
    };

    // 検索条件に一致する総件数
    const total = await prisma.customer.count({ where });

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    // 不正なページ番号や最終ページを超えた指定にも対応
    const currentPage = Number.isSafeInteger(page)
        ? Math.min(Math.max(1, page), totalPages)
        : 1;

    // 現在のページに必要なデータだけ取得
    const customers = await prisma.customer.findMany({
        where,
        orderBy: [
            { createdAt: "desc" },
            { id: "desc" },
        ],
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
    });

    return {
        customers,
        total,
        page: currentPage,
        pageSize,
        totalPages,
        query: keyword,
    };
};

// ダッシュボード用の集計データを取得
export const getDashboardData = async () => {
    const companyId = await getCompanyId();

    const now = new Date();
    const oneWeekAgo = new Date(
        now.getTime() - 7 * 24 * 60 * 60 * 1000
    );

    const dateFilter = {
        createdAt: {
            gte: oneWeekAgo,
            lte: now,
        },
    };

    const [customerCount, projectCount, recentCustomers] =
        await Promise.all([
            prisma.customer.count({
                where: {
                    companyId,
                    ...dateFilter,
                },
            }),
            prisma.project.count({
                where: {
                    companyId,
                    ...dateFilter,
                },
            }),
            prisma.customer.findMany({
                where: {
                    companyId,
                    ...dateFilter,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
            }),
        ]);

    return {
        customerCount,
        projectCount,
        recentCustomers,
    };
};

// 顧客を1件取得
export const getCustomer = async (id: number) => {
    const companyId = await getCompanyId();

    return prisma.customer.findFirst({
        where: {
            id,
            companyId,
        },
    });
};

// 顧客を作成
export const createCustomer = async (formData: FormData) => {
    const companyId = await getCompanyId();

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const address = formData.get("address")?.toString().trim();

    if (!name || !email || !phone || !address) {
        throw new Error("すべての項目を入力してください");
    }

    await prisma.customer.create({
        data: {
            name,
            email,
            phone,
            address,
            companyId,
        },
    });

    revalidatePath("/dashboard");
    revalidatePath("/customers");
    redirect("/customers");
};

// 顧客を更新
export const updateCustomer = async (
    id: number,
    formData: FormData
) => {
    const companyId = await getCompanyId();

    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const address = formData.get("address")?.toString().trim();

    if (!name || !email || !phone || !address) {
        throw new Error("すべての項目を入力してください");
    }

    const customer = await prisma.customer.findFirst({
        where: {
            id,
            companyId,
        },
    });

    if (!customer) {
        throw new Error("顧客が見つかりません");
    }

    await prisma.customer.update({
        where: {
            id: customer.id,
        },
        data: {
            name,
            email,
            phone,
            address,
        },
    });

    revalidatePath("/dashboard");
    revalidatePath("/customers");
    revalidatePath(`/customers/${id}`);
    revalidatePath(`/customers/edit/${id}`);

    redirect("/customers");
};

// 顧客を削除
export const deleteCustomer = async (id: number) => {
    const companyId = await getCompanyId();

    const customer = await prisma.customer.findFirst({
        where: {
            id,
            companyId,
        },
    });

    if (!customer) {
        throw new Error("顧客が見つかりません");
    }

    await prisma.customer.delete({
        where: {
            id: customer.id,
        },
    });

    revalidatePath("/dashboard");
    revalidatePath("/customers");
};