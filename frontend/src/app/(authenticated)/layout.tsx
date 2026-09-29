import { AuthenticatedLayoutWrapper } from "@/components/layout/AuthenticatedWrapper/AuthenticatedLayoutWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Todo App",
    description: "Todo application",
};

export default function AuthenticatedLayout({children}: {children: React.ReactNode}) {
    return (
        <AuthenticatedLayoutWrapper>
            {children}
        </AuthenticatedLayoutWrapper>
    );
}
