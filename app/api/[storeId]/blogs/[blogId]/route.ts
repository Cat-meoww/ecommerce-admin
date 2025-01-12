import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: {
    params: Promise<{ blogId: string }>
}) {
    try {
        const slug = await params

        if (!slug.blogId) return new NextResponse("Blog id is Required", { status: 400 })

        const blog = await prismadb.blog.findUnique({
            where: {
                id: slug.blogId,
            },
        })

        return NextResponse.json(blog);
    } catch (error) {
        console.log('[BLOG_GET]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(req: Request, { params }: {
    params: Promise<{ storeId: string, blogId: string }>
}) {
    try {
        const slug = await params

        const { userId } = await auth();

        const body = await req.json()

        const { title, content } = body

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })
        if (!title) return new NextResponse("Title is Required", { status: 400 })
        if (!content) return new NextResponse("Blog Content is Required", { status: 400 })
        if (!slug.blogId) return new NextResponse("BlogId is Required", { status: 400 })


        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: slug.storeId,
                userId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

        const category = await prismadb.blog.updateMany({
            where: {
                id: slug.blogId,
            },
            data: {
                title,
                content
            }
        })

        return NextResponse.json(category);
    } catch (error) {
        console.log('[BLOG_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: {
    params: Promise<{ storeId: string, blogId: string }>
}) {
    try {
        const slug = await params

        const { userId } = await auth();



        if (!userId) return new NextResponse("Unauthorized", { status: 401 })

        if (!slug.storeId) return new NextResponse("Store id is Required", { status: 400 })

        if (!slug.blogId) return new NextResponse("Blog id is Required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: slug.storeId,
                userId
            }
        })

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 })

        const category = await prismadb.blog.delete({
            where: {
                id: slug.blogId,
            }
        })

        return NextResponse.json(category);
    } catch (error) {
        console.log('[BLOG_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}