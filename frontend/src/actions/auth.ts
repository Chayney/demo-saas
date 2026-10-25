"use server";

import { prisma } from "@/external/lib/prisma";
import { hash } from "bcryptjs";
import { signIn, signOut } from "@/config/auth";
import { redirect } from "next/navigation";

// サーバー側で所属先の会社IDを取得・検証する処理を実装してください。
// フォームから渡された companyId をそのまま信用しないこと。
const getAuthorizedCompanyId = async (): Promise<number> => {
    throw new Error("所属先の会社IDを取得する処理を実装してください");
};

export const registerUser = async (formData: FormData) => {
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const passwordOrg = formData.get("password")?.toString();

    if (!name || !email || !passwordOrg) {
        throw new Error("入力が不足しています");
    }

    const companyId = await getAuthorizedCompanyId();

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new Error("このメールアドレスは既に登録されています");
    }

    const password = await hash(passwordOrg, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password,
            role: 0,
            company: {
                connect: {
                    id: companyId,
                },
            },
        },
    });

    redirect("/login");
};

export const loginUser = async (formData: FormData) => {
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
        throw new Error("入力が不足しています");
    }

    await signIn("credentials", {
        email,
        password,
        redirectTo: "/dashboard",
    });
};

export const logoutUser = async () => {
    await signOut({
        redirectTo: "/login",
    });
};