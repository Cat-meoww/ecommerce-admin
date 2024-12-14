import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function PATCH(req: Request, { params }: {
    params: Promise<{ storeId: string }>
}) {
    try {
        const slug = await params

        const { userId } = await auth();

        const body = await req.json()

        const { name } = body

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!name) return new NextResponse("Name is Required", { status: 400 })
        if (!slug.storeId) return new NextResponse("Store id is Required", { status: 400 })

        const store = await prismadb.store.updateMany({
            where: {
                id: slug.storeId,
                userId,
            },
            data: {
                name
            }
        })

        return NextResponse.json(store);
    } catch (error) {
        console.log('[STORE_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
export async function DELETE(req: Request, { params }: {
    params: Promise<{ storeId: string }>
}) {
    try {
        const slug = await params

        const { userId } = await auth();



        if (!userId) return new NextResponse("Unauthorized", { status: 401 })

        if (!slug.storeId) return new NextResponse("Store id is Required", { status: 400 })

        const store = await prismadb.store.deleteMany({
            where: {
                id: slug.storeId,
                userId,
            }
        })

        return NextResponse.json(store);
    } catch (error) {
        console.log('[STORE_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}