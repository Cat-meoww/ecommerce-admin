import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: {
    params: Promise<{ colorId: string }>
}) {
    try {
        const slug = await params

        if (!slug.colorId) return new NextResponse("Color id is Required", { status: 400 })

        const color = await prismadb.size.findUnique({
            where: {
                id: slug.colorId,
            }
        })

        return NextResponse.json(color);
    } catch (error) {
        console.log('[COlOR_GET]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: {
    params: Promise<{ storeId: string, colorId: string }>
}) {
    try {
        const slug = await params

        const { userId } = await auth();

        const body = await req.json()

        const { name, value } = body

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!name) return new NextResponse("Name is Required", { status: 400 })
        if (!value) return new NextResponse("Value Id is Required", { status: 400 })
        if (!slug.colorId) return new NextResponse("Size is Required", { status: 400 })


        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: slug.storeId,
                userId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

        const color = await prismadb.color.updateMany({
            where: {
                id: slug.colorId,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(color);
    } catch (error) {
        console.log('[COlOR_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: {
    params: Promise<{ storeId: string, colorId: string }>
}) {
    try {
        const slug = await params

        const { userId } = await auth();



        if (!userId) return new NextResponse("Unauthorized", { status: 401 })

        if (!slug.storeId) return new NextResponse("Store id is Required", { status: 400 })

        if (!slug.colorId) return new NextResponse("Color id is Required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: slug.storeId,
                userId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

        const color = await prismadb.color.deleteMany({
            where: {
                id: slug.colorId,
            }
        })

        return NextResponse.json(color);
    } catch (error) {
        console.log('[COlOR_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}