import { z } from 'zod';

export type StringifiedData<T extends object> = {
    [K in keyof T]: string | null;
};

export type LabelValue = {
    label: string;
    value: string;
};

//Cabins
export const cabinSchema = z.object({
    id: z.number(),
    created_at: z.string(),
    name: z.string(),
    description: z.string(),
    discount: z.number(),
    image: z.string(),
    maxCapacity: z.number(),
    regularPrice: z.number(),
});
export const cabinArraySchema = z.array(
    cabinSchema.pick({
        id: true,
        name: true,
        maxCapacity: true,
        regularPrice: true,
        discount: true,
        image: true,
    })
);
export const cabinPriceSchema = cabinSchema.pick({
    regularPrice: true,
    discount: true,
});

export type TCabin = z.infer<typeof cabinSchema>;
export type TCabinArray = z.infer<typeof cabinArraySchema>;
export type TCabinSubmit = StringifiedData<
    Omit<TCabin, 'id' | 'created_at' | 'image'>
> & {
    image: FileList | string | null;
};
export type TCabinPrice = z.infer<typeof cabinPriceSchema>;
export type TCreateEditCabinData = StringifiedData<
    Omit<TCabin, 'id' | 'created_at' | 'image'>
> & {
    image: File | string | null;
};

//Guests
export const guestSchema = z.object({
    id: z.number(),
    created_at: z.string(),
    fullName: z.string(),
    email: z.string(),
    nationalID: z.string(),
    nationality: z.string(),
    countryFlag: z.string().nullable(),
});

//Bookings
export const bookingSchema = z.object({
    id: z.number(),
    created_at: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    numNights: z.number(),
    numGuests: z.number(),
    cabinPrice: z.number(),
    extrasPrice: z.number(),
    totalPrice: z.number(),
    status: z.union([
        z.literal('unconfirmed'),
        z.literal('checked-in'),
        z.literal('checked-out'),
    ]),
    hasBreakfast: z.boolean(),
    isPaid: z.boolean(),
    observations: z.string().nullable(),
    cabinId: z.number(),
    guestId: z.number(),
});

export const getBookingsSchema = z.array(
    bookingSchema
        .pick({
            id: true,
            created_at: true,
            startDate: true,
            endDate: true,
            numGuests: true,
            numNights: true,
            status: true,
            totalPrice: true,
            cabinId: true,
            guestId: true,
        })
        .extend({
            cabins: cabinSchema.pick({ name: true, image: true }),
        })
);

// const getBookingSchema = bookingSchema.extend({
//     cabins: cabinSchema,
//     guests: guestSchema,
// });

const getBookingsAfterDateSchema = z.array(
    bookingSchema.pick({
        created_at: true,
        extrasPrice: true,
        totalPrice: true,
    })
);
const getStaysAfterDateSchema = z.array(
    bookingSchema.extend({
        guests: guestSchema.pick({ fullName: true }),
    })
);

const getStaysTodayActivitySchema = z.array(
    bookingSchema.extend({
        guests: guestSchema.pick({
            fullName: true,
            nationality: true,
            countryFlag: true,
        }),
    })
);

export type TBooking = z.infer<typeof bookingSchema>;
export type TGetBookings = z.infer<typeof getBookingsSchema>;
export type TGetBooking = z.infer<typeof getBookingsSchema>[number];
export type TBookingsAfterDate = z.infer<typeof getBookingsAfterDateSchema>;
export type TStaysAfterDate = z.infer<typeof getStaysAfterDateSchema>;
export type TTodayActivities = z.infer<typeof getStaysTodayActivitySchema>;
export type AllowableQueryMethods = 'eq' | 'lte' | 'gte';
export interface FilterAndSort {
    filter:
        | (LabelValue & {
              method: AllowableQueryMethods;
          })
        | null;
    sortBy: {
        field: string;
        direction: string;
    };
    page: number;
}
