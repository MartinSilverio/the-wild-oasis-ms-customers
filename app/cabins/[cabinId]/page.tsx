import Cabin from '@/app/_components/Cabin';
import Reservation from '@/app/_components/Reservation';
import Spinner from '@/app/_components/Spinner';
import { getCabin, getCabins } from '@/app/_lib/data-service';
import { Suspense } from 'react';

type TCabinPageParams = {
    params: { cabinId: string };
};

export async function generateMetadata({ params }: TCabinPageParams) {
    const { name } = await getCabin(params.cabinId);
    return { title: `Cabin ${name}` };
}

export async function generateStaticParams() {
    const cabins = await getCabins();

    const ids = cabins.map((cabin) => ({ cabinId: String(cabin.id) }));

    return ids;
}

export default async function Page({ params }: TCabinPageParams) {
    const cabin = await getCabin(params.cabinId);

    const { name } = cabin;

    return (
        <div className="mx-auto mt-8 max-w-6xl">
            <Cabin cabin={cabin} />
            <div>
                <h2 className="mb-10 text-center text-5xl font-semibold text-accent-400">
                    Reserve {name} today. Pay on arrival.
                </h2>
                <Suspense fallback={<Spinner />}>
                    <Reservation cabin={cabin} />
                </Suspense>
            </div>
        </div>
    );
}
