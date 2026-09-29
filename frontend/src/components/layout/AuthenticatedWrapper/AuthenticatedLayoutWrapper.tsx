import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./style.module.css";

export const AuthenticatedLayoutWrapper = ({children}: {children: ReactNode}) => {
    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>Todo App</div>

                <nav className={styles.nav}>
                    <Link href="/todos" className={styles.navLink}>
                        Todo一覧
                    </Link>

                    <Link href="/todos/create" className={styles.navLink}>
                        Todoを作成
                    </Link>
                </nav>
            </aside>

            <div className={styles.mainArea}>
                <header className={styles.header}>
                    <h1 className={styles.headerTitle}>Todo App</h1>
                </header>

                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}
