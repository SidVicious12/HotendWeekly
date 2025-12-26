import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client for public write access if needed, or rely on RLS
// Ideally use service role for admin tasks, but for public insert we can use anon key with RLS policy
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export async function POST(request: NextRequest) {
    if (!supabase) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const { error } = await supabase
            .from('waitlist_emails')
            .insert({
                email,
                source: 'landing_page'
            });

        if (error) {
            if (error.code === '23505') { // Unique violation
                return NextResponse.json({ message: 'You are already on the waitlist!' });
            }
            throw error;
        }

        return NextResponse.json({ success: true, message: 'Welcome to the waitlist!' });
    } catch (error) {
        console.error('Waitlist error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
