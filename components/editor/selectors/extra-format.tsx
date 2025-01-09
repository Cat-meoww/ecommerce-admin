'use client'
import { cn } from "@/lib/utils";
import { EllipsisVerticalIcon, SubscriptIcon, SuperscriptIcon, AlignCenterIcon, AlignLeftIcon, AlignRightIcon, AlignJustifyIcon } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";
import type { SelectorItem } from "./node-selector";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


interface ExtraSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}






export const ExtraSelector = ({ open, onOpenChange }: ExtraSelectorProps) => {
    const { editor } = useEditor();
    if (!editor) return null;

    const items: SelectorItem[] = [
        {
            name: "subscript",
            isActive: (editor) => editor.isActive("subscript"),
            command: (editor) => editor.chain().focus().toggleSubscript().run(),
            icon: SubscriptIcon,
        },
        {
            name: "superscript",
            isActive: (editor) => editor.isActive("superscript"),
            command: (editor) => editor.chain().focus().toggleSuperscript().run(),
            icon: SuperscriptIcon,
        },
        {
            name: "align Left",
            isActive: (editor) => editor.isActive({
                textAlign: "left"
            }),
            command: (editor) => editor.chain().focus().setTextAlign("left").run(),
            icon: AlignLeftIcon,
        },
        {
            name: "align Center",
            isActive: (editor) => editor.isActive({
                textAlign: "center"
            }),
            command: (editor) => editor.chain().focus().setTextAlign("center").run(),
            icon: AlignCenterIcon,
        },
        {
            name: "align Right",
            isActive: (editor) => editor.isActive({
                textAlign: "right"
            }),
            command: (editor) => editor.chain().focus().setTextAlign('right').run(),
            icon: AlignRightIcon,
        },
        {
            name: "align Justify",
            isActive: (editor) => editor.isActive({
                textAlign: "justify"
            }),
            command: (editor) => editor.chain().focus().setTextAlign('justify').run(),
            icon: AlignJustifyIcon,
        },
    ];

    return (
        <Popover modal={true} open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button size="icon" className={
                    editor.isActive('subscript') || editor.isActive('superscript') || editor.isActive("textAlign") ? "bg-accent" : ""
                } variant="ghost">
                    <EllipsisVerticalIcon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                sideOffset={8}
                side="top"
                className="my-1 inline-flex w-max  flex-row gap-0.5  overflow-y-auto rounded border p-1 shadow-xl overflow-visible"
                align="start"
            >


                {items.map((item, index) => (
                    <EditorBubbleItem
                        key={index}
                        onSelect={(editor) => {
                            item.command(editor);
                        }}
                    >
                        <Button size="icon" type="button" className={cn({
                            "bg-accent": item.isActive(editor),
                        })} variant="ghost">
                            <item.icon
                                className="h-4 w-4"
                            />
                        </Button>
                    </EditorBubbleItem>
                ))}





            </PopoverContent>
        </Popover>
    );
};