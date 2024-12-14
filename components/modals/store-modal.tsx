'use client'

import { Modal } from "@/components/ui/modal"
import { useStoreModal } from "@/hooks/use-store-modal"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner"


import axios from 'axios'
const formSchema = z.object({
    name: z.string().min(1)
})

//Constructing using modal layout
export const StoreModal = () => {
    const storeModal = useStoreModal();

    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        try {
            setLoading(true);
            const response = await axios.post('/api/stores', values)


            window.location.assign(`/${response.data.id}`)


            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Something went wrong", {
                position: "bottom-center"
            })
        } finally {
            setLoading(false)
        }
    }
    return (
        <Modal title="Create Store"
            description={"Add a new Store to mange products and Categories"}
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder="E-commerce"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">

                                <Button disabled={loading} variant={'outline'} onClick={storeModal.onClose} >Cancel</Button>
                                <Button type="submit">Continue</Button>
                            </div>

                        </form>
                    </Form>

                </div>
            </div>


        </Modal>
    )
}