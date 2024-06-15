'use server';

import { z } from 'zod';
import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';
import { revalidatePath } from 'next/cache';

// The updatedFields is an object which should ONLY contain the updated data
export async function updateGuest(id: string, updatedFields: string) {}

export async function updateProfile(formData: FormData) {
    const session = await auth();

    //Common practice to not use try catch for server action, but to throw, as it will be caught by an error boundary
    if (!session) throw new Error('You must be logged in');

    console.log(formData);

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

        console.log({ updateData });

        const { data, error } = await supabase
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

export async function signInAction() {
    await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
    await signOut({ redirectTo: '/' });
}
