'use client'
import { cn } from "@/lib/utils";
import { EditorBubbleItem, useEditor } from "novel";
import {
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    StrikethroughIcon,
    CodeIcon,
    FileCodeIcon
} from "lucide-react";
import type { SelectorItem } from "./node-selector";
import { Button } from "@/components/ui/button";

export const TextButtons = () => {
    const { editor } = useEditor();
    if (!editor) return null;

    const items: SelectorItem[] = [
        {
            name: "bold",
            isActive: (editor) => editor.isActive("bold"),
            command: (editor) => editor.chain().focus().toggleBold().run(),
            icon: BoldIcon,
        },
        {
            name: "italic",
            isActive: (editor) => editor.isActive("italic"),
            command: (editor) => editor.chain().focus().toggleItalic().run(),
            icon: ItalicIcon,
        },
        {
            name: "underline",
            isActive: (editor) => editor.isActive("underline"),
            command: (editor) => editor.chain().focus().toggleUnderline().run(),
            icon: UnderlineIcon,
        },
        {
            name: "strike",
            isActive: (editor) => editor.isActive("strike"),
            command: (editor) => editor.chain().focus().toggleStrike().run(),
            icon: StrikethroughIcon,
        },
        {
            name: "code",
            isActive: (editor) => editor.isActive("code"),
            command: (editor) => editor.chain().focus().toggleCode().run(),
            icon: CodeIcon,
        },
        {
            name: "code block",
            isActive: (editor) => editor.isActive("codeblock"),
            command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
            icon: FileCodeIcon,
        },
    ];

    return (
        <span className="flex gap-0.5">
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
        </span>
    );
};