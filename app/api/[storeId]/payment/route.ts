import { NextResponse } from "next/server";

import { razorpay } from "@/lib/razorpay";
import { createHmac } from 'crypto'
import prismadb from "@/lib/prismadb";


interface paymentRequest {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string
}


const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {

    try {
        const paymentRequest: paymentRequest = await req.json();
        const { storeId } = await params;

        const generated_signature = createHmac('sha256', process.env?.RAZORPAY_KEY_SECRET ?? '')
            .update(paymentRequest.razorpay_order_id + "|" + paymentRequest.razorpay_payment_id)
            .digest('hex');


        if (generated_signature !== paymentRequest.razorpay_signature) {
            throw Error("Invalid signature.");
        }

        const payment = await razorpay.payments.fetch(paymentRequest.razorpay_payment_id)

        if (payment.status !== "captured") {
            throw new Error("Payment verification failed.");
        }

        await prismadb.order.updateMany({
            where: { storeId: storeId, razorpayOrderId: paymentRequest.razorpay_order_id },
            data: {
                isPaid: true,
                phone: payment.contact.toString(),
                address: payment.email
            }
        });
        return NextResponse.json(
            { status: true, message: "Payment verified successfully." },
            {
                headers: corsHeaders
            }
        );
    } catch (err) {
        return NextResponse.json(
            { status: false, message: (err as Error).message },
            {
                status: 500,
                headers: corsHeaders
            }
        );
    }
}
