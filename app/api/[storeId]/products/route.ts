import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: Request, { params }: {
    params: Promise<{ storeId: string }>
}) {
    try {
        const slug = await params

        const { userId } = await auth();

        const body = await req.json()

        const {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived
        } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
        }
        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }
        if (!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }
        if (!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
        }
        if (!sizeId) {
            return new NextResponse("Size id is required", { status: 400 });
        }

        if (!slug.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: slug.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }



        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                storeId: slug.storeId,
                images: {
                    createMany: {
                        data: [...images.map((image: { url: string }) => image)]
                    }
                }
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
export async function GET(req: NextRequest, { params }: {
    params: Promise<{ storeId: string }>
}) {
    try {
        const slug = await params


        const categoryId = req.nextUrl.searchParams.get("categoryId") || undefined;
        const colorId = req.nextUrl.searchParams.get("colorId") || undefined;
        const sizeId = req.nextUrl.searchParams.get("sizeId") || undefined;
        const isFeatured = req.nextUrl.searchParams.get("isFeatured");

        const products = await prismadb.product.findMany({
            where: {
                storeId: slug.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.log("[PRODUCTS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}
