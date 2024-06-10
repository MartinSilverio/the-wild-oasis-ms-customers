import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.error('Missing DB keys for Wild Oasis data!');
    throw new Error(
        'Missing DB Keys: Please add SUPABASE_URL and SUPABASE_KEY'
    );
}

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);
