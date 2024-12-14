import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: {
    params: Promise<{  billboardId: string }>
}) {
    try {
        const slug = await params


        if (!slug.billboardId) return new NextResponse("Billboard id is Required", { status: 400 })

        

        

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: slug.billboardId,
            }
        })

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: {
    params: Promise<{ storeId: string, billboardId: string }>
}) {
    try {
        const slug = await params

        const { userId } = await auth();

        const body = await req.json()

        const { label, imageUrl } = body

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!label) return new NextResponse("Label is Required", { status: 400 })
        if (!imageUrl) return new NextResponse("Image is Required", { status: 400 })
        if (!slug.billboardId) return new NextResponse("Billboard is Required", { status: 400 })


        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: slug.storeId,
                userId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: slug.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        })

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARDS_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: {
    params: Promise<{ storeId: string, billboardId: string }>
}) {
    try {
        const slug = await params

        const { userId } = await auth();



        if (!userId) return new NextResponse("Unauthorized", { status: 401 })

        if (!slug.storeId) return new NextResponse("Store id is Required", { status: 400 })

        if (!slug.billboardId) return new NextResponse("Billboard id is Required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: slug.storeId,
                userId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: slug.billboardId,
            }
        })

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARDS_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}