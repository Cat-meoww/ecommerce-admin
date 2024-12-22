// import Stripe from "stripe";
import { NextResponse } from "next/server";

import { razorpay } from "@/lib/razorpay";
import prismadb from "@/lib/prismadb";

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
    const { productIds } = await req.json();

    if (!productIds || productIds.length === 0) {
        return new NextResponse("Product ids are required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
        where: {
            id: {
                in: productIds
            }
        }
    });

    // const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];




    // products.forEach(product => {
    //     line_items.push({
    //         quantity: 1,
    //         price_data: {
    //             currency: "INR",
    //             product_data: {
    //                 name: product.name
    //             },
    //             unit_amount: product.price.toNumber() * 100
    //         }
    //     });
    // });

    const order = await prismadb.order.create({
        data: {
            storeId: (await params).storeId,
            isPaid: false,
            orderItems: {
                create: products.map((product) => {

                    return {
                        product: {
                            connect: {
                                id: product.id
                            }
                        },
                        quantity: 1,
                        price: product.price,
                        subTotal: Number(product.price) * 1
                    };
                })
            },
            total: 30,
        }
    });

    razorpay.orders.create({
        amount: Number(order.total),
        currency: "INR",
        receipt: order.id,
    })

    // const session = await stripe.checkout.sessions.create({
    //     line_items,
    //     mode: "payment",
    //     billing_address_collection: "required",
    //     phone_number_collection: {
    //         enabled: true
    //     },
    //     success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    //     cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    //     metadata: {
    //         orderId: order.id
    //     }
    // });

    return NextResponse.json(
        { url: '', order },
        {
            headers: corsHeaders
        }
    );
}
