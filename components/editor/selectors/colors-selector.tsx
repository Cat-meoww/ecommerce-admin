'use client'
import { HexColorPicker } from "react-colorful";
import { PaletteIcon } from "lucide-react";
import { useEditor } from "novel";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
export interface BubbleColorMenuItem {
    name: string;
    color: string;
}

interface ColorSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const rgbtoHex = (rgb: string) => {
    if (rgb.startsWith("#")) {
        return rgb;
    }
    const [r, g, b] = rgb.slice(4, -1).split(",").map((x) => parseInt(x));
    return `#${(1 << 24) + (r << 16) + (g << 8) + b}`.slice(1);
};
const validateHex = (hex: string) => {
    return /^#[0-9A-F]{6}$/i.test(hex);
}

export const ColorSelector = ({ open, onOpenChange }: ColorSelectorProps) => {
    const { editor } = useEditor();

    const initialColor = editor?.getAttributes("textStyle")?.color ?? '';
    const hexcolor = useMemo(() => rgbtoHex(initialColor), [initialColor]);
    if (!editor) return null;

    return (
        <Popover modal={true} open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button size="icon" className={
                    editor.isActive("textStyle") ? "bg-accent" : ""
                } variant="ghost">
                    <PaletteIcon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                sideOffset={8}
                side="top"
                className="my-1 flex  flex-col gap-2  overflow-y-auto rounded border p-1 shadow-xl overflow-visible"
                align="start"
            >

                <HexColorPicker className="w-full" color={hexcolor} onChange={(color) => editor.chain().focus().setColor(color).run()} />


                <Input placeholder={!validateHex(hexcolor) ? '#000000' : hexcolor} onChange={(e) => {
                    if (validateHex(e.target.value)) {
                        editor.chain().focus().setColor(e.target.value).run();
                    }
                }} />


            </PopoverContent>
        </Popover>
    );
};