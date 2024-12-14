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

        const { name, value } = body

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!name) return new NextResponse("Name is Required", { status: 400 })
        if (!value) return new NextResponse("Value is Required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: slug.storeId,
                userId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: slug.storeId
            }
        })

        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZES_POST]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
export async function GET(req: Request, { params }: {
    params: Promise<{ storeId: string }>
}) {
    try {
        const slug = await params
        
        const sizes = await prismadb.size.findMany({
            where: {
                storeId: slug.storeId
            }
        })

        return NextResponse.json(sizes);
    } catch (error) {
        console.log('[SIZES_GET]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
