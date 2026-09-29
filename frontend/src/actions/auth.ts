"use server";

import { prisma } from "@/external/lib/prisma";
import { hash } from "bcryptjs";
import { signIn, signOut } from "@/config/auth";
import { redirect } from "next/navigation";

export const registerUser = async (formData: FormData) => {
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const passwordOrg = formData.get("password")?.toString();

    if (!name || !email || !passwordOrg) {
        throw new Error("入力が不足しています");
    }

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
        },
    });

    redirect("/login");
};

export const loginUser = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
        throw new Error("入力が不足しています");
    }

    await signIn("credentials", {
        email,
        password,
        redirectTo: "/todos",
    });
};

export const logoutUser = async () => {
    await signOut({
        redirectTo: "/login",
    });
};
