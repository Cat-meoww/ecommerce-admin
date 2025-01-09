import prismadb from "@/lib/prismadb";
import { BlogForm } from "./components/blog-form";

export default async function Billboard({
    params
}: {
    params: Promise<{ storeId: string; blogId: string }>
}) {
    const { blogId } = await params

    const blog = await prismadb.blog.findUnique({
        where: {
            id: blogId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BlogForm initialData={blog} />
            </div>
        </div>
    )

}