// 必ずしも明示する必要はない
"use client";

import { useEffect, useState } from "react";
import { getTodo, getTodos } from "@/actions/todo";
import { Todo } from "@/types/todo";

export const useTodoDetail = (todoId: number) => {
    const [todo, setTodo] = useState<Todo | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Server Actionから取得したTodoをClient側のstateに入れるため
    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const todo = await getTodo(todoId);
                setTodo(todo);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodo();
    }, []);

    return {
        todo,
        isLoading,
    };
};
