'use client';

import Image from 'next/image';
import { useFormStatus } from 'react-dom';
import { updateProfile } from '../_lib/actions';
import { TNewGuest } from '../_lib/data-service.types';

function UpdateProfileForm({
    children,
    guest,
}: {
    children: React.ReactNode;
    guest: TNewGuest;
}) {
    const { fullName, email, nationalID, countryFlag } = guest;

    return (
        <form
            className="flex flex-col gap-6 bg-primary-900 px-12 py-8 text-lg"
            action={updateProfile}
        >
            <div className="space-y-2">
                <label>Full name</label>
                <input
                    disabled
                    name="fullName"
                    defaultValue={fullName}
                    className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
                />
            </div>

            <div className="space-y-2">
                <label>Email address</label>
                <input
                    disabled
                    name="email"
                    defaultValue={email}
                    className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="nationality">Where are you from?</label>
                    <Image
                        src={countryFlag || ''}
                        alt="Country flag"
                        className="h-5 rounded-sm"
                        width={30}
                        height={30}
                    />
                </div>
                {children}
            </div>

            <div className="space-y-2">
                <label htmlFor="nationalID">National ID number</label>
                <input
                    name="nationalID"
                    defaultValue={nationalID || ''}
                    className="w-full rounded-sm bg-primary-200 px-5 py-3 text-primary-800 shadow-sm"
                />
            </div>

            <div className="flex items-center justify-end gap-6">
                <Button />
            </div>
        </form>
    );
}

function Button() {
    const { pending } = useFormStatus();

    return (
        <button
            disabled={pending}
            className="bg-accent-500 px-8 py-4 font-semibold text-primary-800 transition-all hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
        >
            {pending ? 'Updating...' : 'Update profile'}
        </button>
    );
}

export default UpdateProfileForm;
