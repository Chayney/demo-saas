"use client";

import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Project } from "@/types/project";
import styles from "./style.module.css";
import { logoutUser } from "@/actions/auth";

type Props = {
    projects: Project[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    search: string;
};

export const ProjectListTemplate = ({
    projects,
    page,
    pageSize,
    totalCount,
    totalPages,
    search,
}: Props) => {
    const router = useRouter();
    const pathname = usePathname();

    const [searchQuery, setSearchQuery] = useState(search);

    // URLの検索条件が変わった場合に入力欄を同期
    useEffect(() => {
        setSearchQuery(search);
    }, [search]);

    // ページ番号と検索条件からURLを生成
    const createUrl = (nextPage: number, nextSearch: string) => {
        const params = new URLSearchParams();

        if (nextPage > 1) {
            params.set("page", String(nextPage));
        }

        if (nextSearch.trim()) {
            params.set("search", nextSearch.trim());
        }

        const queryString = params.toString();

        return queryString
            ? `${pathname}?${queryString}`
            : pathname;
    };

    // 検索を実行
    const handleSearch = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        router.push(createUrl(1, searchQuery));
    };

    // 検索条件をクリア
    const handleClear = () => {
        setSearchQuery("");
        router.push(createUrl(1, ""));
    };

    // ページ番号付きURLを生成
    const getPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams();

        if (search.trim()) {
            params.set("search", search.trim());
        }

        params.set("page", String(pageNumber));

        return `${pathname}?${params.toString()}`;
    };

    // 現在のページ周辺と先頭・末尾のページを表示
    const visiblePages = useMemo(() => {
        const pages = new Set<number>();

        for (
            let number = Math.max(1, page - 2);
            number <= Math.min(totalPages, page + 2);
            number++
        ) {
            pages.add(number);
        }

        if (totalPages > 0) {
            pages.add(1);
            pages.add(totalPages);
        }

        const sortedPages = Array.from(pages).sort((a, b) => a - b);
        const result: (number | "...")[] = [];

        sortedPages.forEach((number, index) => {
            if (index > 0 && number - sortedPages[index - 1] > 1) {
                result.push("...");
            }

            result.push(number);
        });

        return result;
    }, [page, totalPages]);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    const startCount =
        totalCount === 0 ? 0 : (page - 1) * pageSize + 1;

    const endCount = Math.min(page * pageSize, totalCount);

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        案件一覧
                    </h1>
                    <p className={styles.description}>
                        登録されている案件情報を確認できます。
                    </p>
                </div>

                <Link
                    href="/projects/create"
                    className={styles.projectCreateButton}
                >
                    ＋ 案件を登録
                </Link>

                <form action={logoutUser}>
                    <button
                        type="submit"
                        className={styles.logoutButton}
                    >
                        ログアウト
                    </button>
                </form>
            </div>

            <section className={styles.card}>
                <div className={styles.toolbar}>
                    <form
                        className={styles.searchWrapper}
                        onSubmit={handleSearch}
                    >
                        <svg
                            className={styles.searchIcon}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m16 16 4 4" />
                        </svg>

                        <input
                            type="search"
                            className={styles.searchInput}
                            placeholder="案件名・顧客名・メールアドレスで検索"
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.target.value)
                            }
                            aria-label="案件を検索"
                        />

                        <button
                            type="submit"
                            className={styles.searchButton}
                        >
                            検索
                        </button>
                    </form>

                    <p
                        className={styles.resultCount}
                        aria-live="polite"
                    >
                        <span className={styles.countNumber}>
                            {totalCount}
                        </span>
                        <span>件</span>
                    </p>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th scope="col">案件名</th>
                                <th scope="col">顧客名</th>
                                <th scope="col">メールアドレス</th>
                                <th scope="col">作成日</th>
                                <th scope="col">更新日</th>
                            </tr>
                        </thead>

                        <tbody>
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <tr key={project.id}>
                                        <td className={styles.projectName}>
                                            <Link href={`/projects/${project.id}`}>
                                                {project.name}
                                            </Link>
                                        </td>
                                        <td>{project.customer.name}</td>
                                        <td>{project.customer.email}</td>
                                        <td>{formatDate(project.createdAt)}</td>
                                        <td>{formatDate(project.updatedAt)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className={styles.emptyState}
                                    >
                                        <p>
                                            {search
                                                ? "検索条件に一致する案件が見つかりませんでした。"
                                                : "案件が登録されていません。"}
                                        </p>

                                        {search && (
                                            <button
                                                type="button"
                                                className={styles.resetButton}
                                                onClick={handleClear}
                                            >
                                                検索条件をクリア
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalCount > 0 && (
                    <>
                        <nav
                            className={styles.pagination}
                            aria-label="案件一覧のページネーション"
                        >
                            <Link
                                href={getPageUrl(page - 1)}
                                aria-disabled={page <= 1}
                                tabIndex={page <= 1 ? -1 : undefined}
                                className={
                                    page <= 1
                                        ? styles.disabledPage
                                        : styles.pageLink
                                }
                                onClick={(event) => {
                                    if (page <= 1) {
                                        event.preventDefault();
                                    }
                                }}
                            >
                                前へ
                            </Link>

                            {visiblePages.map((pageNumber, index) => {
                                if (pageNumber === "...") {
                                    return (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className={styles.pageEllipsis}
                                            aria-hidden="true"
                                        >
                                            …
                                        </span>
                                    );
                                }

                                return (
                                    <Link
                                        key={pageNumber}
                                        href={getPageUrl(pageNumber)}
                                        aria-current={
                                            pageNumber === page ? "page" : undefined
                                        }
                                        className={
                                            pageNumber === page
                                                ? styles.activePage
                                                : styles.pageLink
                                        }
                                    >
                                        {pageNumber}
                                    </Link>
                                );
                            })}

                            <Link
                                href={getPageUrl(page + 1)}
                                aria-disabled={page >= totalPages}
                                tabIndex={page >= totalPages ? -1 : undefined}
                                className={
                                    page >= totalPages
                                        ? styles.disabledPage
                                        : styles.pageLink
                                }
                                onClick={(event) => {
                                    if (page >= totalPages) {
                                        event.preventDefault();
                                    }
                                }}
                            >
                                次へ
                            </Link>
                        </nav>

                        <p className={styles.paginationInfo}>
                            {page} / {totalPages} ページ
                            （全 {totalCount} 件）
                        </p>
                    </>
                )}
            </section>
        </main>
    );
};
