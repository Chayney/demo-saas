// 必ずしも明示する必要はない
"use client";

import { useEffect, useState } from "react";
import { getTodos } from "@/actions/todo";
import { Todo } from "@/types/todo";

export const useTodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Server Actionから取得したTodoをClient側のstateに入れるため
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const todos = await getTodos();
                setTodos(todos);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodos();
    }, []);

    return {
        todos,
        isLoading,
    };
};
