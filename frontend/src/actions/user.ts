"use server"

import { prisma } from "@/external/lib/prisma"
import { revalidatePath } from "next/cache"

// "use server"をファイルレベルに置いた場合、Next.jsではexportされる関数は非同期関数である必要がある
// READ系は非同期で処理しなくても良いと思われるためserver actionに置くかは迷い中だが一旦置いておく
export const getUsers = async () => {
    return prisma.user.findMany({
        orderBy: {
            createdAt: "desc"
        },
        include: {
            todos: true
        }
    })
}

export const getUser = async (id: number) => {
    return prisma.user.findUnique({
        where: {
            id
        },
        include: {
            todos: {
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    });
}

export const createUser = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    await prisma.user.create({
        data: {
            name,
            email,
            password
        }
    });

    revalidatePath("/users");
}

export const updateUser = async (id: number, formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    await prisma.user.update({
        where: {
            id
        },
        data: {
            name,
            email
        }
    });

    revalidatePath("/users");
}

export const deleteUser = async (id: number) => {
    await prisma.user.delete({
        where: {
            id
        }
    });

    await revalidatePath("/users");
}