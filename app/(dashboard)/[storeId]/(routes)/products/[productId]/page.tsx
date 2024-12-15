import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";


export default async function Billboard({
    params
}: {
    params: Promise<{ storeId: string; productId: string }>
}) {
    const { storeId, productId } = await params

    const product = await prismadb.product.findUnique({
        where: {
            id: productId
        },
        include: {
            images: true
        }
    });

    const serializedData = product ? {
        ...product,
        price: product.price.toString(),
    } : null;

    const categories = await prismadb.category.findMany({
        where: {
            storeId: storeId
        }
    });

    const sizes = await prismadb.size.findMany({
        where: {
            storeId: storeId
        }
    });
    const colors = await prismadb.color.findMany({
        where: {
            storeId: storeId
        }
    });



    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm
                    initialData={serializedData}
                    categories={categories}
                    colors={colors}
                    sizes={sizes}
                />
            </div>
        </div>
    )

}