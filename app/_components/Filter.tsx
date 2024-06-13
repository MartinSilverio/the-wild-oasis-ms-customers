'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function Filter() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathName = usePathname();
    const activeFilter = searchParams.get('capacity') ?? 'all';

    function handleFilter(filter: string) {
        const params = new URLSearchParams(searchParams);
        params.set('capacity', filter);
        router.replace(`${pathName}?${params.toString()}`, { scroll: false });
    }

    return (
        <div className="flex border border-primary-800">
            <FilterButton
                handleFilter={handleFilter}
                filter="all"
                activeFilter={activeFilter}
            >
                All cabins
            </FilterButton>
            <FilterButton
                handleFilter={handleFilter}
                filter="small"
                activeFilter={activeFilter}
            >
                1&mdash;3 guests
            </FilterButton>
            <FilterButton
                handleFilter={handleFilter}
                filter="medium"
                activeFilter={activeFilter}
            >
                4&mdash;7 guests
            </FilterButton>
            <FilterButton
                handleFilter={handleFilter}
                filter="large"
                activeFilter={activeFilter}
            >
                8&mdash;12 guests
            </FilterButton>
        </div>
    );
}

function FilterButton({
    filter,
    handleFilter,
    activeFilter,
    children,
}: {
    filter: string;
    handleFilter: (s: string) => void;
    activeFilter: string;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={() => handleFilter(filter)}
            className={`px-5 py-2 hover:bg-primary-700 ${filter === activeFilter && `bg-primary-700 text-primary-50`}`}
        >
            {children}
        </button>
    );
}

export default Filter;
