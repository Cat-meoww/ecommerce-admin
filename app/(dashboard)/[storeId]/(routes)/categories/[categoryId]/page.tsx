import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/category-form";

export default async function Billboard({
    params
}: {
    params: Promise<{ storeId: string; categoryId: string }>
}) {
    const { categoryId } = await params

    const billboard = await prismadb.category.findUnique({
        where: {
            id: categoryId
        }
    })
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: (await params).storeId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm billboards={billboards} initialData={billboard} />
            </div>
        </div>
    )

}