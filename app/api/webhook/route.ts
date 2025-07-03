import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`webhook error: ${error.message}`, {
            status: 400,
        });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if (event.type === 'checkout.session.completed') {
        // Handle successful checkout session
        if (!userId || !courseId) {
            return new NextResponse(`webhook error :missing metadata`, {
                status: 400,
            });
        }

        await db.purchase.create({
            data: {
                courseId: courseId,
                userId: userId,
            }
        });
    } else {
        return new NextResponse(`webhook error: unhandled event type ${event.type}`, {
            status: 200,
        });
    }

    return new NextResponse(null, {
        status: 200,
    });

}