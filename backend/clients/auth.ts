import { ExpressAuth } from "@auth/express";
import Google from "@auth/express/providers/google";
import { loginWithGoogle } from "../services/user";

export const authOptions = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!
        })
    ],
    callbacks: {
        async signIn({ user, account }: any) {
            if (account?.provider !== "google" || !user.email || !user.name) {
                return false;
            }

            const dbUser = await loginWithGoogle({
                name: user.name,
                email: user.email
            });

            user.id = String(dbUser.id);

            return true;
        },
        async jwt({ token, user }: any) {
            if (user?.id) {
                token.userId = Number(user.id);
            }

            return token;
        },
        async session({ session, token }: any) {
            if (session.user && token.userId) {
                session.user.id = String(token.userId);
            }

            return session;
        }
    }
};

const authConfig = ExpressAuth(authOptions);

export default authConfig;