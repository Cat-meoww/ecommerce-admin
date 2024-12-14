import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { SettingsForm } from "./components/settings-form"

interface PageProps {
    params: Promise<{ storeId: string }>
}
const SettingPage: React.FC<PageProps> = async ({ params }) => {
    const { userId } = await auth()

    if (!userId) redirect('/sign-in')

    const store = await prismadb.store.findFirst({
        where: {
            id: (await params).storeId,
            userId
        }
    })

    if (!store) redirect('/')


    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">

                <SettingsForm initialData={store} />


            </div>
        </div>
    )

}

export default SettingPage;