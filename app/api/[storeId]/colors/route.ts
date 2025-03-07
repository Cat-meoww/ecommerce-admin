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

        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: slug.storeId
            }
        })

        return NextResponse.json(color);
    } catch (error) {
        console.log('[COLORS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
export async function GET(req: Request, { params }: {
    params: Promise<{ storeId: string }>
}) {
    try {
        const slug = await params
        
        const colors = await prismadb.color.findMany({
            where: {
                storeId: slug.storeId
            }
        })

        return NextResponse.json(colors);
    } catch (error) {
        console.log('[COLORS_GET]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
