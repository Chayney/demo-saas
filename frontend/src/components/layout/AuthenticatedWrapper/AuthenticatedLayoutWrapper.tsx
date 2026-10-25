import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumb } from "../Breadcrumb";
import styles from "./style.module.css";

export const AuthenticatedLayoutWrapper = ({
    children,
}: {
    children: ReactNode;
}) => {
    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    顧客管理システム
                </div>

                <nav className={styles.nav}>
                    <Link href="/dashboard" className={styles.navLink}>
                        ダッシュボード
                    </Link>

                    <Link href="/customers" className={styles.navLink}>
                        顧客一覧
                    </Link>

                    <Link href="/projects" className={styles.navLink}>
                        案件一覧
                    </Link>
                </nav>
            </aside>

            <div className={styles.mainArea}>
                <header className={styles.header}>
                    <Breadcrumb />
                </header>

                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
};