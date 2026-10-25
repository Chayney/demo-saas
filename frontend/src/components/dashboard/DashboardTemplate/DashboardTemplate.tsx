"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutUser } from "@/actions/auth";
import { deleteCustomer } from "@/actions/customer";
import styles from "./style.module.css";
import { useRouter } from "next/navigation";

type Customer = {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    createdAt: Date;
};

type Props = {
    customerCount: number;
    projectCount: number;
    recentCustomers: Customer[];
};

export const DashboardTemplate = ({
    customerCount,
    projectCount,
    recentCustomers,
}: Props) => {
    const router = useRouter();
    const [searchText, setSearchText] = useState("");

    const filteredCustomers = recentCustomers.filter((customer) => {
        const keyword = searchText.toLowerCase();

        return (
            customer.name.toLowerCase().includes(keyword) ||
            customer.email.toLowerCase().includes(keyword)
        );
    });

    const handleDelete = async (id: number) => {
        if (!window.confirm("この顧客を削除しますか？")) {
            return;
        }

        try {
            await deleteCustomer(id);
            router.refresh();
        } catch {
            window.alert("顧客の削除に失敗しました。");
        }
    };

    return (
        <main className={styles.dashboardContainer}>
            <header className={styles.dashboardHeader}>
                <div className={styles.dashboardHeaderTop}>
                    <div>
                        <h1 className={styles.dashboardTitle}>
                            ダッシュボード
                        </h1>

                        <p className={styles.dashboardDescription}>
                            顧客情報や案件の状況を確認できます。
                        </p>
                    </div>

                    <form action={logoutUser}>
                        <button
                            type="submit"
                            className={styles.dashboardLogoutButton}
                        >
                            ログアウト
                        </button>
                    </form>
                </div>
            </header>

            <section
                className={styles.dashboardStats}
                aria-label="集計情報"
            >
                <article className={styles.dashboardStatCard}>
                    <p className={styles.dashboardStatLabel}>
                        登録顧客数
                    </p>

                    <p className={styles.dashboardStatValue}>
                        {customerCount}
                        <span className={styles.dashboardStatUnit}>
                            件
                        </span>
                    </p>

                    <Link
                        href="/customers"
                        className={styles.dashboardStatLink}
                    >
                        顧客一覧を見る →
                    </Link>
                </article>

                <article className={styles.dashboardStatCard}>
                    <p className={styles.dashboardStatLabel}>
                        案件数
                    </p>

                    <p className={styles.dashboardStatValue}>
                        {projectCount}
                        <span className={styles.dashboardStatUnit}>
                            件
                        </span>
                    </p>

                    <Link
                        href="/projects"
                        className={styles.dashboardStatLink}
                    >
                        案件一覧を見る →
                    </Link>
                </article>
            </section>

            <section className={styles.customerSection}>
                <div className={styles.customerSectionHeader}>
                    <div>
                        <h2 className={styles.customerSectionTitle}>
                            最近登録された顧客
                        </h2>

                        <p className={styles.customerSectionDescription}>
                            最新の顧客情報を確認できます。
                        </p>
                    </div>
                </div>

                <div className={styles.customerSearchWrapper}>
                    <input
                        type="search"
                        value={searchText}
                        onChange={(event) =>
                            setSearchText(event.target.value)
                        }
                        placeholder="顧客名・メールアドレスで検索"
                        className={styles.customerSearchInput}
                        aria-label="顧客を検索"
                    />
                </div>

                {filteredCustomers.length === 0 ? (
                    <div className={styles.customerEmptyState}>
                        <p>該当する顧客がいません。</p>
                    </div>
                ) : (
                    <div className={styles.customerGrid}>
                        {filteredCustomers.map((customer) => (
                            <article
                                key={customer.id}
                                className={styles.customerCard}
                            >
                                <div className={styles.customerCardHeader}>
                                    <h3 className={styles.customerCardTitle}>
                                        {customer.name}
                                    </h3>

                                    <div className={styles.customerActions}>
                                        <Link
                                            href={`/customers/${customer.id}`}
                                            className={styles.customerDetailButton}
                                            aria-label={`${customer.name}の詳細`}
                                            title="詳細"
                                        >
                                            👁
                                        </Link>

                                        <Link
                                            href={`/customers/edit/${customer.id}`}
                                            className={styles.customerEditButton}
                                            aria-label={`${customer.name}を編集`}
                                            title="編集"
                                        >
                                            ✎
                                        </Link>

                                        <button
                                            type="button"
                                            className={styles.customerDeleteButton}
                                            onClick={() =>
                                                handleDelete(customer.id)
                                            }
                                            aria-label={`${customer.name}を削除`}
                                            title="削除"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.customerField}>
                                    <span className={styles.customerFieldLabel}>
                                        メールアドレス
                                    </span>
                                    <p className={styles.customerFieldValue}>
                                        {customer.email}
                                    </p>
                                </div>

                                <div className={styles.customerField}>
                                    <span className={styles.customerFieldLabel}>
                                        電話番号
                                    </span>
                                    <p className={styles.customerFieldValue}>
                                        {customer.phone}
                                    </p>
                                </div>

                                <div className={styles.customerField}>
                                    <span className={styles.customerFieldLabel}>
                                        住所
                                    </span>
                                    <p className={styles.customerFieldValue}>
                                        {customer.address}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <div className={styles.customerListFooter}>
                    <Link
                        href="/customers"
                        className={styles.customerListLink}
                    >
                        すべての顧客を見る →
                    </Link>
                </div>
            </section>
        </main>
    );
};