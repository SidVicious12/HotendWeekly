import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerComponentClient({ cookies: () => cookieStore });
        const { data: { user } } = await supabase.auth.getUser();

        // Allow feedback from anonymous users if we are logging them as 'guest'
        const userId = user?.id || 'guest_user';

        const body = await request.json();
        const { generationId, rating, comment } = body;

        if (!generationId || !rating) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { error } = await supabase
            .from('feedback')
            .insert({
                generation_id: generationId,
                user_id: userId,
                rating,
                comment
            });

        if (error) {
            console.error('Feedback insert error:', error);
            return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Feedback submit error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
