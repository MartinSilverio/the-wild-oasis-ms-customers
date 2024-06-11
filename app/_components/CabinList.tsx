// import { unstable_noStore as noStore } from 'next/cache';
import { getCabins } from '../_lib/data-service';
import CabinCard from './CabinCard';

async function CabinList() {
    //For when Partial Pre-rendering gets implemented in Next
    // noStore();
    const cabins = await getCabins();

    if (!cabins.length) return null;

    return (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:gap-12 xl:gap-14">
            {cabins.map((cabin) => (
                <CabinCard cabin={cabin} key={cabin.id} />
            ))}
        </div>
    );
}

export default CabinList;
