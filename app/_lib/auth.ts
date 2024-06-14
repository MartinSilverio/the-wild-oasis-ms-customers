import NextAuth, { Session } from 'next-auth';
import Google from 'next-auth/providers/google';
import { NextRequest } from 'next/server';

const authConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        authorized({
            auth,
            request,
        }: {
            auth: Session | null;
            request: NextRequest;
        }) {
            return !!auth?.user;
        },
    },
    pages: {
        signIn: '/login',
    },
};

export const {
    auth,
    signIn,
    signOut,
    handlers: { GET, POST },
} = NextAuth(authConfig);
