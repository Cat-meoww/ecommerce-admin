import prismadb from "@/lib/prismadb"

import { format } from "date-fns"
import { BlogClient } from "./components/client"
import { TableColumn } from "./components/columns"

interface PageProps {
    params: Promise<{ storeId: string }>
}
const BlogsPage: React.FC<PageProps> = async ({ params }) => {
    const billboards = await prismadb.blog.findMany({
        where: {
            storeId: (await params).storeId
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formatedBillboards: TableColumn[] = billboards.map((item) => ({
        id: item.id,
        title: item.title,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BlogClient data={formatedBillboards} />
            </div>
        </div>
    )

}

export default BlogsPage;