"use server";

import { auth } from "@/config/auth";
import { prisma } from "@/external/lib/prisma"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const getTodos = async () => {
    const session = await auth();

    const userId = Number(session?.user.id);

    return prisma.todo.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export const getTodo = async (id: number) => {
    return prisma.todo.findUnique({
        where: {
            id
        }
    });
}

export const createTodo = async (formData: FormData) => {
    const session = await auth();

    const userId = Number(session?.user.id);

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    await prisma.todo.create({
        data: {
            title,
            content,
            userId: userId,
        },
    });

    revalidatePath("/todos");

    redirect("/todos");
};

export const updateTodo = async (id: number, formData: FormData) => {
    // <form action={handleSubmit}> の仕組みによってFormDataが自動的に生成
    // FormDataのインスタンス作成不要
    const session = await auth();

    const userId = Number(session?.user.id);

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    const todo = await prisma.todo.findFirst({
        where: {
            id,
            userId: userId,
        },
    });

    if (!todo) {
        throw new Error("Todoが見つかりません");
    }

    await prisma.todo.update({
        where: {
            id: todo.id,
        },
        data: {
            title,
            content,
        },
    });

    revalidatePath("/todos");
    revalidatePath(`/todos/${id}`);
    revalidatePath(`/todos/edit/${id}`);

    redirect("/todos");
};


export const deleteTodo = async (id: number) => {
    const todo = await prisma.todo.delete({
        where: {
            id
        }
    });

    revalidatePath(`/users/${todo.userId}`);
}