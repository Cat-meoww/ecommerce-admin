import prismadb from "@/lib/prismadb"

import { format } from "date-fns"
import { ColorsClient } from "./components/client"
import { ColorColumn } from "./components/columns"

interface PageProps {
    params: Promise<{ storeId: string }>
}
const ColorsPage: React.FC<PageProps> = async ({ params }) => {
    const sizes = await prismadb.color.findMany({
        where: {
            storeId: (await params).storeId
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formatedColors: ColorColumn[] = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorsClient  data={formatedColors} />
            </div>
        </div>
    )

}

export default ColorsPage;