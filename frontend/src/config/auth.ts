import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/external/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: {
        strategy: "jwt",
    },

    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials) {
                if (
                    !credentials?.email ||
                    !credentials?.password
                ) {
                    return null;
                }

                const email = String(credentials.email);
                const password = String(credentials.password);

                const user = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                });

                if (!user) {
                    return null;
                }

                const isValid = await compare(
                    password,
                    user.password
                );

                if (!isValid) {
                    return null;
                }

                return {
                    id: String(user.id),
                    name: user.name,
                    email: user.email,
                    companyId: user.companyId,
                    role: user.role,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id;

                // authorize() が返した追加情報を保存
                token.companyId = user.companyId;
                token.role = user.role;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.userId as string;
                session.user.companyId =
                    token.companyId as number;
                session.user.role = token.role as number;
            }

            return session;
        },
    },

    pages: {
        signIn: "/login",
    },
});