"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./style.module.css";

const PAGE_NAMES: Record<string, string> = {
    dashboard: "ダッシュボード",
    customers: "顧客一覧",
    projects: "案件一覧",
    new: "新規登録",
    edit: "編集",
};

export const Breadcrumb = () => {
    const pathname = usePathname();

    const segments = pathname.split("/").filter(Boolean);

    const breadcrumbs = segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;

        let label = PAGE_NAMES[segment] ?? segment;

        // /customers/[id] の ID 部分を「顧客詳細」に変更
        if (
            segments[0] === "customers" &&
            index === 1 &&
            /^\d+$/.test(segment)
        ) {
            label = "顧客詳細";
        }

        // /projects/[id] の ID 部分を「案件詳細」に変更
        if (
            segments[0] === "projects" &&
            index === 1 &&
            /^\d+$/.test(segment)
        ) {
            label = "案件詳細";
        }

        return {
            label,
            href,
        };
    });

    return (
        <nav aria-label="パンくずリスト" className={styles.breadcrumb}>
            {breadcrumbs.map((item, index) => {
                const isCurrent = index === breadcrumbs.length - 1;

                return (
                    <span
                        key={item.href}
                        className={styles.breadcrumbItem}
                    >
                        {index > 0 && (
                            <span
                                className={styles.breadcrumbSeparator}
                                aria-hidden="true"
                            >
                                ＞
                            </span>
                        )}

                        {isCurrent ? (
                            <span
                                className={styles.breadcrumbCurrent}
                                aria-current="page"
                            >
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className={styles.breadcrumbLink}
                            >
                                {item.label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
};