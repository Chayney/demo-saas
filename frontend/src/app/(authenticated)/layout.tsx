import { AuthenticatedLayoutWrapper } from "@/components/layout/AuthenticatedWrapper/AuthenticatedLayoutWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "SaaS App",
    description: "SaaS application",
};

export default function AuthenticatedLayout({children}: {children: React.ReactNode}) {
    return (
        <AuthenticatedLayoutWrapper>
            {children}
        </AuthenticatedLayoutWrapper>
    );
}
