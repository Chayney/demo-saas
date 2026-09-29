"use client";

import styles from "./style.module.css";
import { useTodo } from "@/hooks/useTodo";

export const TodoCreateTemplate = () => {
    const {
        title,
        setTitle,
        isSubmitting,
        handleCreateTodo,
    } = useTodo();

    async function handleSubmit(
        e: React.SyntheticEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        await handleCreateTodo();
    }

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit}
        >
            <div className={styles.inputWrapper}>
                <input
                    className={styles.input}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Todoを入力してください"
                    disabled={isSubmitting}
                />

                <button
                    className={styles.button}
                    type="submit"
                    disabled={isSubmitting || !title.trim()}
                >
                    {isSubmitting ? "追加中..." : "追加"}
                </button>
            </div>
        </form>
    );
};
