"use client";

import Link from "next/link";
import styles from "./style.module.css";
import { useTodoEdit } from "./useTodoEditTemplate";
import { Todo } from "@/types/todo";

type Props = {
    todo: Todo;
};

export const TodoEditTemplate = (props: Props) => {
    const { todo } = props;

    const {
        isSubmitting,
        handleSubmit,
    } = useTodoEdit(todo);

    if (!todo) {
        return (
            <div className={styles.empty}>
                <p>Todoが見つかりませんでした。</p>

                <Link
                    href="/todos"
                    className={styles.backButton}
                >
                    Todo一覧へ戻る
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div>
                        <span className={styles.label}>
                            TODO
                        </span>

                        <h1 className={styles.title}>
                            Todo編集
                        </h1>
                    </div>
                </div>

                <form
                    action={handleSubmit}
                    className={styles.form}
                >
                    <div className={styles.field}>
                        <label
                            htmlFor="title"
                            className={styles.fieldLabel}
                        >
                            タイトル
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            defaultValue={todo.title}
                            className={styles.input}
                            placeholder="Todoのタイトルを入力してください"
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label
                            htmlFor="content"
                            className={styles.fieldLabel}
                        >
                            内容
                        </label>

                        <textarea
                            id="content"
                            name="content"
                            defaultValue={todo.content}
                            className={styles.textarea}
                            placeholder="Todoの内容を入力してください"
                            disabled={isSubmitting}
                            rows={8}
                            required
                        />
                    </div>

                    <div className={styles.actions}>
                        <Link
                            href="/todos"
                            className={styles.cancelButton}
                        >
                            キャンセル
                        </Link>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "保存中..."
                                : "変更を保存"}
                        </button>
                    </div>
                </form>
            </div>

            <div className={styles.bottomAction}>
                <Link
                    href="/todos"
                    className={styles.topButton}
                >
                    ↑ Todo一覧に戻る
                </Link>
            </div>
        </div>
    );
};
