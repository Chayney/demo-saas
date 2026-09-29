"use client";

import { useEffect, useState } from "react";
import { getTodo, updateTodo } from "@/actions/todo";
import { Todo } from "@/types/todo";

export const useTodoEdit = (todoId: number) => {
    const [todo, setTodo] = useState<Todo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const todo = await getTodo(todoId);

                setTodo(todo);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodo();
    }, [todoId]);

    const handleSubmit = async (formData: FormData) => {
        try {
            setIsSubmitting(true);

            await updateTodo(todoId, formData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        todo,
        isLoading,
        isSubmitting,
        handleSubmit,
    };
};
