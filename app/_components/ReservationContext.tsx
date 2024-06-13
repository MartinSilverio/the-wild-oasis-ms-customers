'use client';

import {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useContext,
    useState,
} from 'react';
import { DateRange } from 'react-day-picker';

type TReservationContext = {
    range: DateRange | undefined;
    setRange: (d: DateRange | undefined) => void;
    resetRange: () => void;
};

const ReservationContext = createContext<TReservationContext | undefined>(
    undefined
);

const initialState = { from: undefined, to: undefined };

function ReservationProvider({ children }: { children: ReactNode }) {
    const [range, setRange] = useState<DateRange | undefined>(initialState);
    function resetRange() {
        setRange({ from: undefined, to: undefined });
    }

    return (
        <ReservationContext.Provider value={{ range, setRange, resetRange }}>
            {children}
        </ReservationContext.Provider>
    );
}
function useReservation() {
    const context = useContext(ReservationContext);

    if (context === undefined) {
        throw new Error('useReservation must be used inside Counter Context');
    }

    return context;
}

export { ReservationProvider, useReservation };
