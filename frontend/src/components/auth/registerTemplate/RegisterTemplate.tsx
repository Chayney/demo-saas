import Link from "next/link";
import { registerUser } from "@/actions/auth";
import styles from "./style.module.css";

export const RegisterTemplate = () => {
    return (
        <main className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>ユーザー登録</h1>
                    <p className={styles.description}>
                        アカウントを作成してください。
                    </p>
                </div>

                <form action={registerUser} className={styles.form}>
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
                            minLength={8}
                        />
                    </div>

                    <div className={styles.field}>
                        <label
                            htmlFor="confirmPassword"
                            className={styles.label}
                        >
                            パスワード（確認）
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            className={styles.input}
                            placeholder="もう一度入力してください"
                            required
                            minLength={8}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                    >
                        ユーザー登録
                    </button>
                </form>

                <div className={styles.linkArea}>
                    <p className={styles.linkText}>
                        すでにアカウントをお持ちの方
                    </p>

                    <Link
                        href="/login"
                        className={styles.secondaryButton}
                    >
                        ログイン
                    </Link>
                </div>
            </div>
        </main>
    );
};
