'use client'

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import React from "react"
import { TableColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface BlogClientProps {
    data: TableColumn[]
}

export const BlogClient: React.FC<BlogClientProps> = ({ data }) => {
    const params = useParams();
    const router = useRouter();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Blog (${data.length})`} description="Manage blogs for your store" />
                <Button onClick={() => router.push(`/${params.storeId}/blogs/new`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="title" />
            <ApiList entityName="blogs" entityIdName="blogId" />
        </>
    )
}