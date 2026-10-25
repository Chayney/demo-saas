"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createCustomer } from "@/actions/customer";
import styles from "./style.module.css";

type FormValues = {
    name: string;
    email: string;
    phone: string;
    address: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
    name: "",
    email: "",
    phone: "",
    address: "",
};

export const CustomerCreateTemplate = () => {
    const router = useRouter();

    const [values, setValues] = useState<FormValues>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // 入力値を更新
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;
        const field = name as keyof FormValues;

        setValues((prev) => ({
            ...prev,
            [field]: value,
        }));

        // 入力し直した項目のエラーを解除
        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));

        setSubmitError("");
    };

    // バリデーション
    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!values.name.trim()) {
            newErrors.name = "顧客名を入力してください";
        }

        if (!values.email.trim()) {
            newErrors.email = "メールアドレスを入力してください";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
        ) {
            newErrors.email = "正しいメールアドレスを入力してください";
        }

        if (!values.phone.trim()) {
            newErrors.phone = "電話番号を入力してください";
        } else if (!/^[0-9+\-()\s]+$/.test(values.phone.trim())) {
            newErrors.phone = "電話番号の形式が正しくありません";
        }

        if (!values.address.trim()) {
            newErrors.address = "住所を入力してください";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // 登録処理
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        const formData = new FormData();
        formData.set("name", values.name.trim());
        formData.set("email", values.email.trim());
        formData.set("phone", values.phone.trim());
        formData.set("address", values.address.trim());

        // redirect() を catch で捕まえない
        await createCustomer(formData);
    };

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>顧客作成</h1>
                    <p className={styles.description}>
                        新しい顧客情報を登録します。
                    </p>
                </div>

                <Link
                    href="/customers"
                    className={styles.backButton}
                >
                    一覧に戻る
                </Link>
            </div>

            <section className={styles.card}>
                <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.formFields}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.label}>
                                顧客名 <span className={styles.required}>必須</span>
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={values.name}
                                onChange={handleChange}
                                placeholder="株式会社サンプル"
                                className={`${styles.input} ${errors.name ? styles.inputError : ""
                                    }`}
                                aria-invalid={Boolean(errors.name)}
                            />
                            {errors.name && (
                                <p className={styles.errorMessage}>
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>
                                メールアドレス{" "}
                                <span className={styles.required}>必須</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={values.email}
                                onChange={handleChange}
                                placeholder="sample@example.com"
                                className={`${styles.input} ${errors.email ? styles.inputError : ""
                                    }`}
                                aria-invalid={Boolean(errors.email)}
                            />
                            {errors.email && (
                                <p className={styles.errorMessage}>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone" className={styles.label}>
                                電話番号 <span className={styles.required}>必須</span>
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={values.phone}
                                onChange={handleChange}
                                placeholder="03-1234-5678"
                                className={`${styles.input} ${errors.phone ? styles.inputError : ""
                                    }`}
                                aria-invalid={Boolean(errors.phone)}
                            />
                            {errors.phone && (
                                <p className={styles.errorMessage}>
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="address" className={styles.label}>
                                住所 <span className={styles.required}>必須</span>
                            </label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                value={values.address}
                                onChange={handleChange}
                                placeholder="東京都渋谷区..."
                                className={`${styles.input} ${errors.address ? styles.inputError : ""
                                    }`}
                                aria-invalid={Boolean(errors.address)}
                            />
                            {errors.address && (
                                <p className={styles.errorMessage}>
                                    {errors.address}
                                </p>
                            )}
                        </div>
                    </div>

                    {submitError && (
                        <p className={styles.formError} role="alert">
                            {submitError}
                        </p>
                    )}

                    <div className={styles.actions}>
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
                            {isSubmitting ? "登録中..." : "顧客を登録"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
};