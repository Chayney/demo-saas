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

// 案件一覧を取得
type GetProjectsParams = {
    page?: number;
    search?: string;
};

const PAGE_SIZE = 10;

// 案件一覧を取得（検索・ページネーション対応）
export const getProjects = async ({
    page = 1,
    search = "",
}: GetProjectsParams = {}) => {
    // 開発環境でのエラー画面テスト用（一時的に追加）
    // if (process.env.NODE_ENV === "development") {
    //     throw new Error("案件一覧のエラー画面テスト");
    // }
    const companyId = await getCompanyId();

    const pageSize = PAGE_SIZE;
    const query = search.trim();

    const where = {
        companyId,
        ...(query
            ? {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        customer: {
                            is: {
                                name: {
                                    contains: query,
                                    mode: "insensitive" as const,
                                },
                            },
                        },
                    },
                    {
                        customer: {
                            is: {
                                email: {
                                    contains: query,
                                    mode: "insensitive" as const,
                                },
                            },
                        },
                    },
                ],
            }
            : {}),
    };

    // 検索条件に一致する総件数を取得
    const totalCount = await prisma.project.count({
        where,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    // 不正なページ番号を補正
    const requestedPage = Number.isSafeInteger(page) ? page : 1;
    const currentPage =
        totalPages === 0
            ? 1
            : Math.min(Math.max(requestedPage, 1), totalPages);

    // 対象ページの10件だけ取得
    const projects = await prisma.project.findMany({
        where,
        include: {
            customer: true,
        },
        orderBy: [
            {
                createdAt: "desc",
            },
            {
                id: "desc",
            },
        ],
        skip: (currentPage - 1) * pageSize,
        take: pageSize,
    });

    return {
        projects,
        page: currentPage,
        pageSize,
        totalCount,
        totalPages,
        search: query,
    };
};

// 案件を1件取得
export const getProject = async (id: number) => {
    const companyId = await getCompanyId();

    return prisma.project.findFirst({
        where: {
            id,
            companyId,
        },
        include: {
            customer: true,
        },
    });
};

// 案件を作成
export const createProject = async (formData: FormData) => {
    const companyId = await getCompanyId();

    const name = formData.get("name")?.toString().trim();
    const customerIdValue = formData.get("customerId")?.toString();

    if (!name || !customerIdValue) {
        throw new Error("案件名と顧客を入力してください");
    }

    const customerId = Number(customerIdValue);

    if (!Number.isSafeInteger(customerId) || customerId <= 0) {
        throw new Error("顧客IDが不正です");
    }

    // 自社の顧客であることを確認
    const customer = await prisma.customer.findFirst({
        where: {
            id: customerId,
            companyId,
        },
    });

    if (!customer) {
        throw new Error("顧客が見つかりません");
    }

    await prisma.project.create({
        data: {
            name,
            companyId,
            customerId: customer.id,
        },
    });

    revalidatePath("/projects");
    redirect("/projects");
};

// 案件を更新
export const updateProject = async (
    id: number,
    formData: FormData
) => {
    const companyId = await getCompanyId();

    const name = formData.get("name")?.toString().trim();
    const customerIdValue = formData.get("customerId")?.toString();

    if (!name || !customerIdValue) {
        throw new Error("案件名と顧客を入力してください");
    }

    const customerId = Number(customerIdValue);

    if (!Number.isSafeInteger(customerId) || customerId <= 0) {
        throw new Error("顧客IDが不正です");
    }

    // 更新対象が自社の案件であることを確認
    const project = await prisma.project.findFirst({
        where: {
            id,
            companyId,
        },
    });

    if (!project) {
        throw new Error("案件が見つかりません");
    }

    // 指定された顧客も自社の顧客であることを確認
    const customer = await prisma.customer.findFirst({
        where: {
            id: customerId,
            companyId,
        },
    });

    if (!customer) {
        throw new Error("顧客が見つかりません");
    }

    await prisma.project.update({
        where: {
            id: project.id,
        },
        data: {
            name,
            customerId: customer.id,
        },
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);
    revalidatePath(`/projects/edit/${id}`);

    redirect("/projects");
};

// 案件を削除
export const deleteProject = async (id: number) => {
    const companyId = await getCompanyId();

    // 自社の案件だけ削除可能
    const project = await prisma.project.findFirst({
        where: {
            id,
            companyId,
        },
    });

    if (!project) {
        throw new Error("案件が見つかりません");
    }

    await prisma.project.delete({
        where: {
            id: project.id,
        },
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);
};