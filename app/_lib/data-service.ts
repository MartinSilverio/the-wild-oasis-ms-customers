import {
    TNewBooking,
    TNewGuest,
    bookingSchema,
    cabinArraySchema,
    cabinSchema,
    countrySchema,
    getBookedDatesSchema,
    getBookingsSchema,
    getCountriesSchema,
    guestSchema,
    settingSchema,
} from './data-service.types';
import { eachDayOfInterval } from 'date-fns';
import { supabase } from './supabase';
import { notFound } from 'next/navigation';

/////////////
// GET

export async function getCabin(id: number | string) {
    const { data, error } = await supabase
        .from('cabins')
        .select('*')
        .eq('id', id)
        .single();

    // For testing
    // await new Promise((res) => setTimeout(res, 1000));

    if (error) {
        console.error(error);
        notFound();
    }

    return cabinSchema.parse(data);
}

export async function getCabinPrice(id: number) {
    const { data, error } = await supabase
        .from('cabins')
        .select('regularPrice, discount')
        .eq('id', id)
        .single();

    if (error) {
        console.error(error);
    }

    return cabinSchema.parse(data);
}

export const getCabins = async function () {
    const { data, error } = await supabase
        .from('cabins')
        .select('id, name, maxCapacity, regularPrice, discount, image')
        .order('name');

    // For testing
    // await new Promise((res) => setTimeout(res, 1000));

    if (error) {
        console.error(error);
        throw new Error('Cabins could not be loaded');
    }

    return cabinArraySchema.parse(data);
};

// Guests are uniquely identified by their email address
export async function getGuest(email: string) {
    const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('email', email)
        .single();

    // No error here! We handle the possibility of no guest in the sign in callback
    return guestSchema.parse(data);
}

export async function getBooking(id: number) {
    const { data, error, count } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(error);
        throw new Error('Booking could not get loaded');
    }

    return bookingSchema.parse(data);
}

export async function getBookings(guestId: number) {
    const { data, error, count } = await supabase
        .from('bookings')
        // We actually also need data on the cabins as well. But let's ONLY take the data that we actually need, in order to reduce downloaded data.
        .select(
            'id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)'
        )
        .eq('guestId', guestId)
        .order('startDate');

    if (error) {
        console.error(error);
        throw new Error('Bookings could not get loaded');
    }

    return getBookingsSchema.parse(data);
}

export async function getBookedDatesByCabinId(cabinId: number | string) {
    let today: Date | string = new Date();
    today.setUTCHours(0, 0, 0, 0);
    today = today.toISOString();

    // Getting all bookings
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('cabinId', cabinId)
        .or(`startDate.gte.${today},status.eq.checked-in`);

    if (error) {
        console.error(error);
        throw new Error('Bookings could not get loaded');
    }

    // Converting to actual dates to be displayed in the date picker
    const bookedDates = data
        .map((booking) => {
            return eachDayOfInterval({
                start: new Date(booking.startDate),
                end: new Date(booking.endDate),
            });
        })
        .flat();

    return getBookedDatesSchema.parse(bookedDates);
}

export async function getSettings() {
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

    // For testing
    // await new Promise((res) => setTimeout(res, 2000));

    if (error) {
        console.error(error);
        throw new Error('Settings could not be loaded');
    }

    return settingSchema.parse(data);
}

export async function getCountries() {
    try {
        const res = await fetch(
            //   'https://restcountries.com/v2/all?fields=name,flag'
            'https://countriesnow.space/api/v0.1/countries/flag/images'
        );
        const countries = await res.json();
        return getCountriesSchema.parse(countries.data);
    } catch {
        throw new Error('Could not fetch countries');
    }
}

/////////////
// CREATE

export async function createGuest(newGuest: TNewGuest) {
    const { data, error } = await supabase.from('guests').insert([newGuest]);

    if (error) {
        console.error(error);
        throw new Error('Guest could not be created');
    }

    return data;
}

export async function createBooking(newBooking: TNewBooking) {
    const { data, error } = await supabase
        .from('bookings')
        .insert([newBooking])
        // So that the newly created object gets returned!
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error('Booking could not be created');
    }

    return data;
}

/////////////
// UPDATE

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id: string, updatedFields: string) {
    const { data, error } = await supabase
        .from('guests')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error('Guest could not be updated');
    }
    return data;
}

export async function updateBooking(id: string, updatedFields: string) {
    const { data, error } = await supabase
        .from('bookings')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error(error);
        throw new Error('Booking could not be updated');
    }
    return data;
}

/////////////
// DELETE

export async function deleteBooking(id: string) {
    const { data, error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

    if (error) {
        console.error(error);
        throw new Error('Booking could not be deleted');
    }
    return data;
}
