import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: {
    params: Promise<{ categoryId: string }>
}) {
    try {
        const slug = await params

        if (!slug.categoryId) return new NextResponse("Category id is Required", { status: 400 })

        const category = await prismadb.category.findUnique({
            where: {
                id: slug.categoryId,
            }
        })

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORY_GET]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: {
    params: Promise<{ storeId: string, categoryId: string }>
}) {
    try {
        const slug = await params

        const { userId } = await auth();

        const body = await req.json()

        const { name, billboardId } = body

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!name) return new NextResponse("Name is Required", { status: 400 })
        if (!billboardId) return new NextResponse("Billboard Id is Required", { status: 400 })
        if (!slug.categoryId) return new NextResponse("Category is Required", { status: 400 })


        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: slug.storeId,
                userId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

        const category = await prismadb.category.updateMany({
            where: {
                id: slug.categoryId,
            },
            data: {
                name,
                billboardId
            }
        })

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: {
    params: Promise<{ storeId: string, categoryId: string }>
}) {
    try {
        const slug = await params

        const { userId } = await auth();



        if (!userId) return new NextResponse("Unauthorized", { status: 401 })

        if (!slug.storeId) return new NextResponse("Store id is Required", { status: 400 })

        if (!slug.categoryId) return new NextResponse("Billboard id is Required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: slug.storeId,
                userId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

        const category = await prismadb.category.deleteMany({
            where: {
                id: slug.categoryId,
            }
        })

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}