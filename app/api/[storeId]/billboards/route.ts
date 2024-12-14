import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(req: Request, { params }: {
    params: Promise<{ storeId: string }>
}) {
    try {
        const slug = await params

        const { userId } = await auth();

        const body = await req.json()

        const { label, imageUrl } = body

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!label) return new NextResponse("Label is Required", { status: 400 })
        if (!imageUrl) return new NextResponse("Image is Required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: slug.storeId,
                userId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: slug.storeId
            }
        })

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARDS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
export async function GET(req: Request, { params }: {
    params: Promise<{ storeId: string }>
}) {
    try {
        const slug = await params
        
        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: slug.storeId
            }
        })

        return NextResponse.json(billboards);
    } catch (error) {
        console.log('[BILLBOARDS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
