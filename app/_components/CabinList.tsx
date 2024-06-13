// import { unstable_noStore as noStore } from 'next/cache';
import { getCabins } from '../_lib/data-service';
import CabinCard from './CabinCard';

async function CabinList({ filter }: { filter: string }) {
    //For when Partial Pre-rendering gets implemented in Next
    // noStore();
    const cabins = await getCabins();

    if (!cabins.length) return null;

    let displayedCabins = cabins;
    if (filter === 'small')
        displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
    if (filter === 'medium')
        displayedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 7);
    if (filter === 'large')
        displayedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);

    return (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:gap-12 xl:gap-14">
            {displayedCabins.map((cabin) => (
                <CabinCard cabin={cabin} key={cabin.id} />
            ))}
        </div>
    );
}

export default CabinList;
