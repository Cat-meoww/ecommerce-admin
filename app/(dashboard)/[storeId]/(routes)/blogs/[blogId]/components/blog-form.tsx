"use client";
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Blog } from "@prisma/client"
import { Trash } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import * as z from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
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
import BlogEditor from "@/components/editor/BlockEditor"

const formSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1)
})


interface ComponentProps {
    initialData: Blog | null
}

type BlogFormValues = z.infer<typeof formSchema>;

export const BlogForm: React.FC<ComponentProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const editOptions = {
        title: "Edit blog",
        description: "Edit a blog",
        toastMessage: "Blog updated",
        action: "Saved changes"
    }
    const createOptions = {
        title: "Create blog",
        description: "Create a blog",
        toastMessage: "Blog created",
        action: "Create"
    }
    const metadata = initialData ? editOptions : createOptions


    const onSubmit = async (data: BlogFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/blogs/${params.blogId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/blogs`, data)
            }
            router.refresh(); //re-sync the server componenent and set initial data
            router.push(`/${params.storeId}/blogs`)
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

            await axios.delete(`/api/${params.storeId}/blogs/${params.blogId}`)
            router.refresh(); //re-sync the server componenent and set initial data
            router.push(`/${params.storeId}/blogs`);

            toast.success("Blog deleted", {
                position: "top-center",
            })

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Make sure you removed all category using this Blog first.", {
                position: "bottom-center"
            })
        } finally {
            setLoading(false)
            setOpen(false)
        }

    }

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            title: '',
            content: '',
        }
    });

    useEffect(() => {

    }, []);


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

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Blog title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="col-span-12">
                            <FormField control={form.control} name="content" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Blog Content</FormLabel>
                                    <FormControl>

                                        <BlogEditor />

                                        {/* <BlogEditor data={field.value} onChange={(content) => field.onChange(content)} /> */}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                        </div>
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