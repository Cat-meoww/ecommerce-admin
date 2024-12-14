import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/color-form";

export default async function ColorPage({
    params
}: {
    params: Promise<{ storeId: string; colorId: string }>
}) {
    const { colorId } = await params

    const size = await prismadb.color.findUnique({
        where: {
            id: colorId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeForm  initialData={size} />
            </div>
        </div>
    )

}