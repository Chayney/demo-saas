"use client";

import { SyntheticEvent, useState } from "react";
import Link from "next/link";
import { updateCustomer } from "@/actions/customer";
import type { Customer } from "@/types/customer";
import styles from "./style.module.css";

type Props = {
    customer: Customer;
};

export const CustomerEditTemplate = ({ customer }: Props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);
        setError("");

        const formData = new FormData(e.currentTarget);

        try {
            await updateCustomer(customer.id, formData);
        } catch (error) {
            if (
                error &&
                typeof error === "object" &&
                "digest" in error &&
                typeof error.digest === "string" &&
                error.digest.startsWith("NEXT_REDIRECT")
            ) {
                throw error;
            }

            setError(
                error instanceof Error
                    ? error.message
                    : "顧客情報の更新に失敗しました"
            );
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>顧客情報の編集</h1>
                    <p className={styles.description}>
                        顧客の詳細情報を確認・編集できます。
                    </p>
                </div>

                <Link href="/customers" className={styles.backButton}>
                    顧客一覧に戻る
                </Link>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>基本情報</h2>
                        <p className={styles.cardDescription}>
                            顧客の連絡先情報を管理します。
                        </p>
                    </div>

                    <div className={styles.cardBody}>
                        <div className={styles.field}>
                            <label htmlFor="name" className={styles.label}>
                                顧客名
                                <span className={styles.required}>必須</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={customer.name}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="email" className={styles.label}>
                                メールアドレス
                                <span className={styles.required}>必須</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={customer.email}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="phone" className={styles.label}>
                                電話番号
                                <span className={styles.required}>必須</span>
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                defaultValue={customer.phone}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="address" className={styles.label}>
                                住所
                                <span className={styles.required}>必須</span>
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                defaultValue={customer.address}
                                className={styles.textarea}
                                rows={3}
                                required
                            />
                        </div>
                    </div>
                </section>

                {error && (
                    <p role="alert" className={styles.errorMessage}>
                        {error}
                    </p>
                )}

                <div className={styles.formActions}>
                    <Link
                        href="/customers"
                        className={styles.cancelButton}
                    >
                        キャンセル
                    </Link>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "保存中..." : "変更を保存"}
                    </button>
                </div>
            </form>
        </div>
    );
};