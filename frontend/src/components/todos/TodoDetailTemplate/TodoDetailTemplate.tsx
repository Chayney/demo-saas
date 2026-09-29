"use client";

import Link from "next/link";
import styles from "./style.module.css";
import { useTodoDetail } from "./useTodoDetailTemplate";

type Props = {
    id: string;
};

export const TodoDetailTemplate = (props: Props) => {
    const { id } = props;
    const todoId = Number(id);

    const { todo, isLoading } = useTodoDetail(todoId);

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    if (!todo) {
        return (
            <div className={styles.empty}>
                <p>Todoが見つかりませんでした。</p>

                <Link href="/todos" className={styles.backButton}>
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
                        <span className={styles.label}>TODO</span>
                        <h1 className={styles.title}>
                            Todo詳細
                        </h1>
                    </div>

                    <Link
                        href={`/todos/edit/${todo.id}`}
                        className={styles.editButton}
                    >
                        編集
                    </Link>
                </div>

                <div className={styles.field}>
                    <span className={styles.fieldLabel}>
                        タイトル
                    </span>

                    <p className={styles.titleValue}>
                        {todo.title}
                    </p>
                </div>

                <div className={styles.field}>
                    <span className={styles.fieldLabel}>
                        内容
                    </span>

                    <p className={styles.content}>
                        {todo.content}
                    </p>
                </div>

                <div className={styles.metadata}>
                    <div>
                        <span className={styles.metadataLabel}>
                            作成日時
                        </span>
                        <span className={styles.metadataValue}>
                            {todo.createdAt?.toLocaleString("ja-JP")}
                        </span>
                    </div>

                    <div>
                        <span className={styles.metadataLabel}>
                            更新日時
                        </span>
                        <span className={styles.metadataValue}>
                            {todo.updatedAt?.toLocaleString("ja-JP")}
                        </span>
                    </div>
                </div>
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
