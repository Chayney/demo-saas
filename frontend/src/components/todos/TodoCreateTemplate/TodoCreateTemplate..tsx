"use client";

import styles from "./style.module.css";
import { useTodoCreateTemplate } from "./useTodoCreateTemplate";

export const TodoCreateTemplate = () => {
    const {
        isSubmitting,
        handleCreateTodo,
    } = useTodoCreateTemplate();

    async function handleSubmit(
        e: React.SyntheticEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        await handleCreateTodo(formData);
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
                    name="title"
                    placeholder="タイトルを入力してください"
                    disabled={isSubmitting}
                    required
                />

                <textarea
                    className={styles.textarea}
                    name="content"
                    placeholder="内容を入力してください"
                    disabled={isSubmitting}
                    rows={5}
                />

                <button
                    className={styles.button}
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "追加中..." : "追加"}
                </button>
            </div>
        </form>
    );
};
