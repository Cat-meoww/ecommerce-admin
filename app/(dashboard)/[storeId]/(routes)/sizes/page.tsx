import prismadb from "@/lib/prismadb"

import { format } from "date-fns"
import { SizesClient } from "./components/client"
import { SizeColumn } from "./components/columns"

interface PageProps {
    params: Promise<{ storeId: string }>
}
const SizesPage: React.FC<PageProps> = async ({ params }) => {
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: (await params).storeId
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formatedSizes: SizeColumn[] = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizesClient  data={formatedSizes} />
            </div>
        </div>
    )

}

export default SizesPage;