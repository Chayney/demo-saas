import styles from "./loading.module.css";

export default function CustomerLoading() {
    return (
        <main className={styles.container} aria-busy="true">
            <section
                className={styles.loadingCard}
                role="status"
                aria-live="polite"
            >
                <div className={styles.spinner} aria-hidden="true" />

                <h1 className={styles.title}>
                    顧客情報を読み込んでいます...
                </h1>

                <p className={styles.description}>
                    データを取得しています。しばらくお待ちください。
                </p>

                <div className={styles.progressTrack} aria-hidden="true">
                    <div className={styles.progressBar} />
                </div>

                <p className={styles.progressText}>
                    読み込み中
                </p>
            </section>
        </main>
    );
}