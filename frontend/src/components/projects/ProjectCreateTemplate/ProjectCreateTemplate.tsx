"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createProject } from "@/actions/project";
import type { Customer } from "@/types/customer";
import styles from "./style.module.css";

type Props = {
    customers: Customer[];
};

type FormValues = {
    name: string;
    customerId: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
    name: "",
    customerId: "",
};

export const ProjectCreateTemplate = ({ customers }: Props) => {
    const router = useRouter();

    const [values, setValues] = useState<FormValues>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // 入力値を更新
    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;
        const field = name as keyof FormValues;

        setValues((prev) => ({
            ...prev,
            [field]: value,
        }));

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
            newErrors.name = "案件名を入力してください";
        } else if (values.name.trim().length > 100) {
            newErrors.name = "案件名は100文字以内で入力してください";
        }

        if (!values.customerId) {
            newErrors.customerId = "顧客を選択してください";
        } else {
            const customerId = Number(values.customerId);

            if (
                !Number.isSafeInteger(customerId) ||
                customerId <= 0 ||
                !customers.some((customer) => customer.id === customerId)
            ) {
                newErrors.customerId = "正しい顧客を選択してください";
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // 登録処理
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting || !validate()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        const formData = new FormData();
        formData.set("name", values.name.trim());
        formData.set("customerId", values.customerId);

        await createProject(formData);
    };

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>案件作成</h1>
                    <p className={styles.description}>
                        新しい案件を登録します。
                    </p>
                </div>

                <Link href="/projects" className={styles.backButton}>
                    一覧に戻る
                </Link>
            </div>

            <section className={styles.card}>
                <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.formFields}>
                        {/* 案件名 */}
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.label}>
                                案件名
                                <span className={styles.required}>必須</span>
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={values.name}
                                onChange={handleChange}
                                placeholder="新規Webサイト開発"
                                maxLength={100}
                                className={`${styles.input} ${errors.name ? styles.inputError : ""
                                    }`}
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={
                                    errors.name ? "name-error" : undefined
                                }
                            />

                            {errors.name && (
                                <p
                                    id="name-error"
                                    className={styles.errorMessage}
                                    role="alert"
                                >
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* 顧客選択 */}
                        <div className={styles.formGroup}>
                            <label
                                htmlFor="customerId"
                                className={styles.label}
                            >
                                顧客
                                <span className={styles.required}>必須</span>
                            </label>

                            <select
                                id="customerId"
                                name="customerId"
                                value={values.customerId}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.customerId
                                        ? styles.inputError
                                        : ""
                                    }`}
                                aria-invalid={Boolean(errors.customerId)}
                                aria-describedby={
                                    errors.customerId
                                        ? "customerId-error"
                                        : undefined
                                }
                                disabled={customers.length === 0}
                            >
                                <option value="">
                                    顧客を選択してください
                                </option>

                                {customers.map((customer) => (
                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                    >
                                        {customer.name}
                                    </option>
                                ))}
                            </select>

                            {errors.customerId && (
                                <p
                                    id="customerId-error"
                                    className={styles.errorMessage}
                                    role="alert"
                                >
                                    {errors.customerId}
                                </p>
                            )}

                            {customers.length === 0 && (
                                <p className={styles.helpText}>
                                    登録済みの顧客がありません。
                                    先に顧客を登録してください。
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
                            href="/projects"
                            className={styles.cancelButton}
                        >
                            キャンセル
                        </Link>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={
                                isSubmitting || customers.length === 0
                            }
                        >
                            {isSubmitting
                                ? "登録中..."
                                : "案件を登録"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
};