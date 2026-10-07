import { createTodo } from "@/actions/todo";
import { useState } from "react";

export const useTodoCreateTemplate = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleCreateTodo(formData: FormData) {
        if (isSubmitting) {
            return;
        }

        try {
            setIsSubmitting(true);

            await createTodo(formData);
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    }

    return {
        isSubmitting,
        handleCreateTodo,
    };
};
