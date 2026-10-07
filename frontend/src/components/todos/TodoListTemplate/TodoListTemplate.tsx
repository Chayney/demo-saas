"use client";

import Link from "next/link";
import { logoutUser } from "@/actions/auth";
import styles from "./style.module.css";
import { useTodoList } from "./useTodoListTemplate";
import { Todo } from "@/types/todo";

type Props = {
    todos: Todo[];
};

export const TodoListTemplate = (props: Props) => {
    const { todos } = props;

    const {
        searchText,
        setSearchText,
        filteredTodos,
        handleSearch,
    } = useTodoList(todos);

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <div>
                        <h2 className={styles.title}>Todo一覧</h2>

                        <p className={styles.description}>
                            登録されているTodoを確認できます。
                        </p>
                    </div>

                    <form action={logoutUser}>
                        <button
                            type="submit"
                            className={styles.logoutButton}
                        >
                            ログアウト
                        </button>
                    </form>
                </div>

                <form
                    className={styles.searchForm}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}
                >
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Todoのタイトルを検索"
                        className={styles.searchInput}
                    />

                    <button
                        type="submit"
                        className={styles.searchButton}
                    >
                        検索
                    </button>
                </form>
            </div>

            <div className={styles.todoGrid}>
                {filteredTodos.map((todo) => (
                    <div
                        key={todo.id}
                        className={styles.todoCard}
                    >
                        <div className={styles.todoCardHeader}>
                            <h3 className={styles.todoCardHeading}>
                                Todo
                            </h3>

                            <div className={styles.todoActions}>
                                <Link
                                    href={`/todos/${todo.id}`}
                                    className={styles.detailButton}
                                    aria-label={`${todo.title}の詳細を見る`}
                                    title="詳細"
                                >
                                    👁
                                </Link>

                                <Link
                                    href={`/todos/edit/${todo.id}`}
                                    className={styles.editButton}
                                    aria-label={`${todo.title}を編集`}
                                    title="編集"
                                >
                                    ✎
                                </Link>

                                <button
                                    type="button"
                                    className={styles.deleteButton}
                                    aria-label={`${todo.title}を削除`}
                                    title="削除"
                                    onClick={() => {
                                        if (
                                            window.confirm(
                                                "このTodoを削除しますか？"
                                            )
                                        ) {
                                            // TODO: 削除処理
                                        }
                                    }}
                                >
                                    🗑
                                </button>
                            </div>
                        </div>

                        <div className={styles.todoField}>
                            <span className={styles.todoLabel}>
                                タイトル
                            </span>

                            <h3 className={styles.todoTitle}>
                                {todo.title}
                            </h3>
                        </div>

                        <div className={styles.todoField}>
                            <span className={styles.todoLabel}>
                                内容
                            </span>

                            <p className={styles.todoContent}>
                                {todo.content}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};