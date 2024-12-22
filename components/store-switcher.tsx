'use client'

import { Store } from "@prisma/client";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { useStoreModal } from "@/hooks/use-store-modal";
import { useParams, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ChevronsUpDown, Check, Store as StoreIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";



type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[]
}
export default function StoreSwitcher({
    className, items = []
}: StoreSwitcherProps) {

    const storeModal = useStoreModal()
    const params = useParams();
    const router = useRouter()

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }))

    const currentStore = formattedItems.find((item) => item.value === params.storeId)

    const [open, setOpen] = useState(false)


    const onStoreSelect = (store: { value: string, label: string }) => {
        setOpen(false)
        router.push(`/${store.value}`)
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" role="combobox"
                    aria-expanded={open}
                    className={cn("w-[200px] justify-between", className)}
                >
                    <StoreIcon className="mr-2 h-4 w-4 " />
                    {currentStore?.label}
                    <ChevronsUpDown className="opacity-50 ml-auto h-4 w-4 shrink-0 " />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">

                <Command>
                    <CommandInput placeholder="Search store..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup heading="Stores">
                            {formattedItems.map((store) => (
                                <CommandItem
                                    key={store.value}
                                    className="text-sm"
                                    onSelect={() => onStoreSelect(store)}
                                >
                                    <StoreIcon className="mr-2 h-4 w-4"></StoreIcon>
                                    {store.label}

                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            currentStore?.value === store.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />

                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />

                    <CommandList>
                        <CommandGroup>
                            <CommandItem onSelect={() => {
                                setOpen(true)
                                storeModal.onOpen();
                            }}>
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}