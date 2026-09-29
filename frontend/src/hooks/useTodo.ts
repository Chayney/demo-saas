"use client";

import { useState } from "react";
import { createTodo, updateTodo } from "@/actions/todo";

export const useTodo = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateTodo = async () => {
        if (!title.trim() || !content.trim()) return;

        try {
            setIsSubmitting(true);

            const formData = new FormData();

            formData.append("title", title.trim());
            formData.append("content", content.trim());

            await createTodo(formData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateTodo = async (todoId: number) => {
        if (!title.trim() || !content.trim()) return;

        try {
            setIsSubmitting(true);

            const formData = new FormData();

            formData.append("title", title.trim());
            formData.append("content", content.trim());

            await updateTodo(todoId, formData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        title,
        setTitle,
        content,
        setContent,
        isSubmitting,
        handleCreateTodo,
        handleUpdateTodo,
    };
};
