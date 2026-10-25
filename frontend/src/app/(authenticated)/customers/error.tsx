"use client";

import { useEffect } from "react";
import styles from "./error.module.css";

type Props = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function CustomerError({ error, reset }: Props) {
    useEffect(() => {
        console.error("顧客一覧の取得に失敗しました", error);
    }, [error]);

    return (
        <main className={styles.container}>
            <section className={styles.card} role="alert">
                <div className={styles.icon}>!</div>

                <h1 className={styles.title}>
                    顧客情報を取得できませんでした
                </h1>

                <p className={styles.description}>
                    通信状況を確認して、もう一度お試しください。
                </p>

                <button
                    type="button"
                    className={styles.retryButton}
                    onClick={reset}
                >
                    再試行
                </button>
            </section>
        </main>
    );
}