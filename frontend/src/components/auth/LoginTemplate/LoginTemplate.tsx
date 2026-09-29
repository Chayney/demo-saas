import Link from "next/link";
import { loginUser } from "@/actions/auth";
import styles from "./style.module.css";

export const LoginTemplate = () => {
    return (
        <main className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>ログイン</h1>
                    <p className={styles.description}>
                        アカウントにログインしてください。
                    </p>
                </div>

                <form action={loginUser} className={styles.form}>
                    <div className={styles.field}>
                        <label
                            htmlFor="email"
                            className={styles.label}
                        >
                            メールアドレス
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            className={styles.input}
                            placeholder="example@example.com"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label
                            htmlFor="password"
                            className={styles.label}
                        >
                            パスワード
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            className={styles.input}
                            placeholder="パスワードを入力"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                    >
                        ログイン
                    </button>
                </form>

                <div className={styles.linkArea}>
                    <p className={styles.linkText}>
                        アカウントをお持ちでない方
                    </p>

                    <Link
                        href="/register"
                        className={styles.secondaryButton}
                    >
                        新規登録
                    </Link>
                </div>
            </div>
        </main>
    );
};
