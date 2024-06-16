'use client';

import { useOptimistic } from 'react';
import { TGetBooking } from '../_lib/data-service.types';
import ReservationCard from './ReservationCard';
import { deleteReservation } from '../_lib/actions';

function ReservationList({ bookings }: { bookings: TGetBooking[] }) {
    const [optimisticBookings, optimisticDelete] = useOptimistic(
        bookings,
        (currentBookings, bookingId: number) => {
            return currentBookings.filter(
                (booking) => booking.id !== bookingId
            );
        }
    );

    async function handleDelete(bookingId: number) {
        optimisticDelete(bookingId);
        await deleteReservation(bookingId);
    }

    return (
        <ul className="space-y-6">
            {optimisticBookings.map((booking) => (
                <ReservationCard
                    onDelete={handleDelete}
                    booking={booking}
                    key={booking.id}
                />
            ))}
        </ul>
    );
}

export default ReservationList;
