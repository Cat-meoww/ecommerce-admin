"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TableColumn = {
    id: string
    title: string
    createdAt: string
}

export const columns: ColumnDef<TableColumn>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    }, {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
