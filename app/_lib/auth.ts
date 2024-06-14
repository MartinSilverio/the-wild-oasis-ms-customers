import NextAuth, {
    Account,
    DefaultSession,
    Profile,
    Session,
    User,
} from 'next-auth';
import Google from 'next-auth/providers/google';
import { NextRequest } from 'next/server';
import { createGuest, getGuest } from './data-service';

declare module 'next-auth' {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's id in supabase */
            guestId: number;
            /**
             * By default, TypeScript merges new interface properties and overwrites existing ones.
             * In this case, the default session user properties will be overwritten,
             * with the new ones defined above. To keep the default session user properties,
             * you need to add them back into the newly declared interface.
             */
        } & DefaultSession['user'];
    }
}

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
        async signIn({
            user,
            account,
            profile,
        }: {
            user: User;
            account: Account | null;
            profile?: Profile | undefined;
        }) {
            try {
                const existingGuest = await getGuest(user.email);
                console.log({ existingGuest });

                if (!existingGuest) {
                    if (!user.email || !user.name)
                        throw new Error('Missing necessary fields');

                    await createGuest({
                        email: user.email,
                        fullName: user.name,
                    });
                }

                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        //Called after signIn and whenever we call auth() in the code
        async session({ session, user }: { session: Session; user: User }) {
            const guest = await getGuest(session.user?.email);

            if (!guest || isNaN(guest?.id) || !session.user) {
                throw new Error('Something went wrong');
            }

            session.user.guestId = guest.id;

            return session;
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
