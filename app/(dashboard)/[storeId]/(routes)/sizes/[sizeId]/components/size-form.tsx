'use client'

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Size } from "@prisma/client"
import { Trash } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import * as z from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
})


interface ComponentProps {
    initialData: Size | null,
}

type SizeFormValues = z.infer<typeof formSchema>;

export const SizeForm: React.FC<ComponentProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const editOptions = {
        title: "Edit size",
        description: "Edit a size",
        toastMessage: "Size updated",
        action: "Saved changes"
    }
    const createOptions = {
        title: "Create size",
        description: "Add a new size ",
        toastMessage: "Size created",
        action: "Create"
    }
    const metadata = initialData ? editOptions : createOptions


    const onSubmit = async (data: SizeFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/sizes`, data)
            }
            router.refresh(); //re-sync the server componenent and set initial data
            router.push(`/${params.storeId}/sizes`)
            toast.success(metadata.toastMessage, {
                position: "top-center",
            })

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Something went wrong", {
                position: "bottom-center"
            })
        } finally {
            setLoading(false)
        }

    }

    const onDelete = async () => {
        try {
            setLoading(true);

            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
            router.refresh(); //re-sync the server componenent and set initial data
            router.push(`/${params.storeId}/sizes`);

            toast.success("Size deleted", {
                position: "top-center",
            })

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Make sure you remove all products using this size.", {
                position: "bottom-center"
            })
        } finally {
            setLoading(false)
            setOpen(false)
        }

    }



    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });
    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
            <div className="flex items-center justify-between">
                <Heading title={metadata.title} description={metadata.description} />
                {initialData && (
                    <Button disabled={loading} variant={'destructive'} size="icon" onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                )}

            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Size name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="value" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Size Value" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                    </div>
                    <Button disabled={loading} type="submit" className="ml-auto">
                        {metadata.action}
                    </Button>
                </form>
            </Form>
            <Separator />
        </>
    )
}