import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: {
    params: Promise<{ sizeId: string }>
}) {
    try {
        const slug = await params

        if (!slug.sizeId) return new NextResponse("Size id is Required", { status: 400 })

        const category = await prismadb.size.findUnique({
            where: {
                id: slug.sizeId,
            }
        })

        return NextResponse.json(category);
    } catch (error) {
        console.log('[SIZE_GET]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: {
    params: Promise<{ storeId: string, sizeId: string }>
}) {
    try {
        const slug = await params

        const { userId } = await auth();

        const body = await req.json()

        const { name, value } = body

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!name) return new NextResponse("Name is Required", { status: 400 })
        if (!value) return new NextResponse("Value Id is Required", { status: 400 })
        if (!slug.sizeId) return new NextResponse("Size is Required", { status: 400 })


        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: slug.storeId,
                userId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

        const size = await prismadb.size.updateMany({
            where: {
                id: slug.sizeId,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZE_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: {
    params: Promise<{ storeId: string, sizeId: string }>
}) {
    try {
        const slug = await params

        const { userId } = await auth();



        if (!userId) return new NextResponse("Unauthorized", { status: 401 })

        if (!slug.storeId) return new NextResponse("Store id is Required", { status: 400 })

        if (!slug.sizeId) return new NextResponse("Size id is Required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: slug.storeId,
                userId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

        const size = await prismadb.size.deleteMany({
            where: {
                id: slug.sizeId,
            }
        })

        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZE_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}