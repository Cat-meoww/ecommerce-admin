import prismadb from "@/lib/prismadb"


interface DashboardLayoutProps {
    params: Promise<{ storeId: string }>
}
export default async function DashboardPage({ params }: DashboardLayoutProps) {

    const store = await prismadb.store.findFirst({
        where: {
            id: (await params).storeId
        }
    })
    return (
        <div>
            Store Name {store?.name}
        </div>
    )
} 