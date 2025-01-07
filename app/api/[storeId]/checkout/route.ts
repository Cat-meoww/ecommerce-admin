// import Stripe from "stripe";
import { NextResponse } from "next/server";

import { razorpay } from "@/lib/razorpay";
import prismadb from "@/lib/prismadb";


interface cartItem {
    id: string,
    quantity: number
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
    const cart: cartItem[] = await req.json();

    if (!cart || cart.length === 0) {
        return new NextResponse("Required atleast one cart item", { status: 400 });
    }

    const products = await prismadb.product.findMany({
        where: {
            id: {
                in: cart.map((item) => item.id)
            }
        }
    });


    const orderItems = cart.map((cartItem) => {
        const product = products.find((product) => product.id === cartItem.id);
        if (!product) {
            throw new Error(`Product with id ${cartItem.id} not found`);
        }
        return {
            product: {
                connect: {
                    id: product.id
                }
            },
            quantity: cartItem.quantity,
            price: product.price,
            subTotal: Number(product.price) * cartItem.quantity
        };
    });

    const total = orderItems.reduce((sum, item) => sum + item.subTotal, 0);

    const order = await prismadb.order.create({
        data: {
            storeId: (await params).storeId,
            isPaid: false,
            orderItems: {
                create: orderItems
            },
            total: total,
        }
    });





    const payment = await razorpay.orders.create({
        amount: Number(order.total) * 100,
        currency: "INR",
        receipt: order.id,
    })

    await prismadb.order.update({
        where: { id: order.id },
        data: { razorpayOrderId: payment.id }
    });




    return NextResponse.json(
        { order, payment },
        {
            headers: corsHeaders
        }
    );
}
