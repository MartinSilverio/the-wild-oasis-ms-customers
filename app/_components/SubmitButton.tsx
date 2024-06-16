'use client';

import { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

function UpdateReservationButton({
    children,
    pendingText,
}: {
    children: ReactNode;
    pendingText: string;
}) {
    const { pending } = useFormStatus();
    return (
        <button
            disabled={pending}
            className="bg-accent-500 px-8 py-4 font-semibold text-primary-800 transition-all hover:bg-accent-600 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
        >
            {pending ? pendingText : children}
        </button>
    );
}

export default UpdateReservationButton;
