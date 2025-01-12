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

        const { title, content } = body

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!title) return new NextResponse("Blog Title is required", { status: 400 })
        if (!content) return new NextResponse("Blog content is required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: slug.storeId,
                userId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

        const category = await prismadb.blog.create({
            data: {
                title,
                content,
                storeId: slug.storeId
            }
        })

        return NextResponse.json(category);
    } catch (error) {
        console.log('[BLOGS_POST]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
export async function GET(req: Request, { params }: {
    params: Promise<{ storeId: string }>
}) {
    try {
        const slug = await params
        
        const categories = await prismadb.blog.findMany({
            where: {
                storeId: slug.storeId
            }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.log('[BLOGS_GET]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
