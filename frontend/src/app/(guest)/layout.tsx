import { GuestLayoutWrapper } from "@/components/layout/GuestLayoutWrapper/GuestLayoutWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Todo App",
    description: "Todo application",
};

export default function GuestLayout({ children }: { children: React.ReactNode }) {
    return (
        <GuestLayoutWrapper>
            {children}
        </GuestLayoutWrapper>
    );
}
