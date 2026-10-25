
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { Customer } from "@/types/customer";
import styles from "./style.module.css";
import { logoutUser } from "@/actions/auth";

type Props = {
    customers: Customer[];
    page: number;
    totalPages: number;
    total: number;
    query: string;
};

export const CustomerListTemplate = ({
    customers,
    page,
    totalPages,
    total,
    query,
}: Props) => {
    const [searchQuery, setSearchQuery] = useState(query);

    const router = useRouter();
    const pathname = usePathname();

    // URLの検索条件が変わったら入力欄も同期する
    useEffect(() => {
        setSearchQuery(query);
    }, [query]);

    // 検索実行
    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const params = new URLSearchParams();
        const keyword = searchQuery.trim();

        if (keyword) {
            params.set("q", keyword);
        }

        // 検索条件が変わったら1ページ目に戻す
        params.set("page", "1");

        router.push(`${pathname}?${params.toString()}`);
    };

    // 検索条件をクリア
    const handleClear = () => {
        setSearchQuery("");
        router.push(pathname);
    };

    // ページ番号付きURLを生成
    const getPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams();

        if (query) {
            params.set("q", query);
        }

        params.set("page", String(pageNumber));

        return `${pathname}?${params.toString()}`;
    };

    // 現在ページの前後1ページと、先頭・末尾を表示
    const pageNumbers: number[] = [];

    for (
        let number = Math.max(1, page - 1);
        number <= Math.min(totalPages, page + 1);
        number++
    ) {
        pageNumbers.push(number);
    }

    if (pageNumbers.length > 0 && pageNumbers[0] !== 1) {
        pageNumbers.unshift(1);
    }

    if (
        pageNumbers.length > 0 &&
        pageNumbers[pageNumbers.length - 1] !== totalPages
    ) {
        pageNumbers.push(totalPages);
    }

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>顧客一覧</h1>
                    <p className={styles.description}>
                        登録されている顧客情報を確認できます。
                    </p>
                </div>

                <Link
                    href="/customers/create"
                    className={styles.customerCreateButton}
                >
                    ＋ 顧客を登録
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
                        role="search"
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
                            placeholder="顧客名・メールアドレスなどで検索"
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.target.value)
                            }
                            aria-label="顧客を検索"
                        />

                        {searchQuery && (
                            <button
                                type="button"
                                className={styles.clearButton}
                                onClick={handleClear}
                                aria-label="検索条件をクリア"
                            >
                                ×
                            </button>
                        )}

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
                            {total}
                        </span>
                        <span>件</span>
                    </p>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th scope="col">顧客名</th>
                                <th scope="col">会社名・住所</th>
                                <th scope="col">メールアドレス</th>
                                <th scope="col">電話番号</th>
                            </tr>
                        </thead>

                        <tbody>
                            {customers.length > 0 ? (
                                customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td className={styles.customerName}>
                                            <Link href={`/customers/${customer.id}`}>
                                                {customer.name}
                                            </Link>
                                        </td>
                                        <td>{customer.address || "-"}</td>
                                        <td>{customer.email || "-"}</td>
                                        <td>{customer.phone || "-"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className={styles.emptyState}>
                                        {query ? (
                                            <>
                                                <p>検索条件に一致する顧客が見つかりませんでした。</p>
                                                <button
                                                    type="button"
                                                    className={styles.resetButton}
                                                    onClick={handleClear}
                                                >
                                                    検索条件をクリア
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <p>顧客がまだ登録されていません。</p>
                                                <Link
                                                    href="/customers/create"
                                                    className={styles.customerCreateButton}
                                                >
                                                    ＋ 顧客を登録
                                                </Link>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {total > 0 && (
                    <nav
                        className={styles.pagination}
                        aria-label="顧客一覧のページネーション"
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

                        {pageNumbers.map((pageNumber, index) => {
                            const previousPage = pageNumbers[index - 1];

                            return (
                                <span
                                    key={pageNumber}
                                    className={styles.pageItem}
                                >
                                    {previousPage !== undefined &&
                                        pageNumber - previousPage > 1 && (
                                            <span
                                                className={styles.pageEllipsis}
                                                aria-hidden="true"
                                            >
                                                …
                                            </span>
                                        )}

                                    <Link
                                        href={getPageUrl(pageNumber)}
                                        aria-current={
                                            pageNumber === page
                                                ? "page"
                                                : undefined
                                        }
                                        className={
                                            pageNumber === page
                                                ? styles.activePage
                                                : styles.pageLink
                                        }
                                    >
                                        {pageNumber}
                                    </Link>
                                </span>
                            );
                        })}

                        <Link
                            href={getPageUrl(page + 1)}
                            aria-disabled={page >= totalPages}
                            tabIndex={
                                page >= totalPages ? -1 : undefined
                            }
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
                )}

                {total > 0 && (
                    <p className={styles.paginationInfo}>
                        {page} / {totalPages} ページ
                        （全 {total} 件）
                    </p>
                )}
            </section>
        </main>
    );
};
