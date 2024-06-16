'use server';

import { z } from 'zod';
import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';
import { revalidatePath } from 'next/cache';
import { getBooking, getBookings } from './data-service';
import { redirect } from 'next/navigation';

// The formData is an object which should ONLY contain the updated data
export async function updateProfile(formData: FormData) {
    const session = await auth();

    //Common practice to not use try catch for server action, but to throw, as it will be caught by an error boundary
    //Check if user is authenticated
    if (!session) throw new Error('You must be logged in');

    try {
        const nationalID = z
            .string()
            .min(6)
            .max(12)
            .regex(/^[a-zA-Z0-9]+$/, { message: 'Must be alphanumeric' })
            .parse(formData.get('nationalID'));

        const nationalityFormData = z
            .string()
            .parse(formData.get('nationality'));
        const [nationality, countryFlag] = nationalityFormData.split('%');

        const updateData = { nationality, countryFlag, nationalID };

        const { error } = await supabase
            .from('guests')
            .update(updateData)
            .eq('id', session.user.guestId);

        if (error) {
            throw new Error('Guest could not be updated');
        }

        revalidatePath('/account/profile');
    } catch (err) {
        if (err instanceof z.ZodError) {
            throw new Error(err.issues[0].message);
        }
        if (err instanceof Error) {
            throw new Error(err.message);
        }
        throw new Error('Something went wrong');
    }
}

export async function deleteReservation(bookingId: number) {
    const session = await auth();

    //Common practice to not use try catch for server action, but to throw, as it will be caught by an error boundary
    //Check if user is authenticated
    if (!session) throw new Error('You must be logged in');

    //We need to check if current user owns this reservation
    const guestBookings = await getBookings(session.user.guestId);
    const guestBookingIds = guestBookings.map((booking) => booking.id);

    if (!guestBookingIds.includes(bookingId))
        throw new Error('You are not allowed to delete this booking');

    const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

    if (error) {
        throw new Error('Booking could not be deleted');
    }
    revalidatePath('/account/reservations');
}

const updateReservationSchema = z.object({
    reservationId: z.coerce.number(),
    numGuests: z.coerce.number(),
    observations: z.string().optional(),
});

export async function updateReservation(formData: FormData) {
    const session = await auth();

    if (!session) throw new Error('You must be logged in');

    //Validate fields exist
    const validatedFields = updateReservationSchema.safeParse({
        reservationId: formData.get('reservationId'),
        numGuests: formData.get('numGuests'),
        observations: formData.get('observations'),
    });

    if (!validatedFields.success) {
        throw new Error('Missing required fields');
    }
    const { reservationId, numGuests, observations } = validatedFields.data;

    //Check if booking belong to the user
    const guestBookings = await getBookings(session.user.guestId);
    const guestBookingIds = guestBookings.map((booking) => booking.id);

    if (!guestBookingIds.includes(reservationId))
        throw new Error('You are not allowed to delete this booking');

    // Update data
    const { error } = await supabase
        .from('bookings')
        .update({ numGuests, observations: observations?.slice(0, 1000) })
        .eq('id', reservationId)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error('Reservation could not be updated');
    }

    //Revalidate path
    revalidatePath('/account/reservations');
    revalidatePath(`/account/reservations/edit/${reservationId}`);

    //Redirect
    redirect('/account/reservations');
}

export async function signInAction() {
    await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
    await signOut({ redirectTo: '/' });
}
