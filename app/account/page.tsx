import { auth } from '../_lib/auth';

export const metadata = {
    title: 'Guest area',
};

export default async function Page() {
    const session = await auth();
    const name = session?.user?.name ? session.user.name.split(' ')[0] : 'User';

    return (
        <h2 className="mb-7 text-2xl font-semibold text-accent-400">
            Welcome, {name}
        </h2>
    );
}
