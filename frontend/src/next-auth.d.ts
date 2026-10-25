import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface User {
        companyId: number;
        role: number;
    }

    interface Session {
        user: {
            id: string;
            companyId: number;
            role: number;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId?: string;
        companyId?: number;
        role?: number;
    }
}