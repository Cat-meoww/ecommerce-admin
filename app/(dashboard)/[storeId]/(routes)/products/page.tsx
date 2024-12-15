import prismadb from "@/lib/prismadb"

import { format } from "date-fns"
import { ProductClient } from "./components/client"
import { ProductColumn } from "./components/columns"
import { formatter } from "@/lib/utils"

interface PageProps {
    params: Promise<{ storeId: string }>
}
const ProductsPage: React.FC<PageProps> = async ({ params }) => {
    const products = await prismadb.product.findMany({
        where: {
            storeId: (await params).storeId
        },
        include: {
            category: true,
            size: true,
            color: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formatedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        size: item.size.name,
        color: item.color.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formatedProducts} />
            </div>
        </div>
    )

}

export default ProductsPage;