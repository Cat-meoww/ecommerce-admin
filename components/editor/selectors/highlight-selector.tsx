'use client'
import { HexColorPicker } from "react-colorful";
import { HighlighterIcon, UndoIcon } from "lucide-react";
import { useEditor } from "novel";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
export interface BubbleColorMenuItem {
  name: string;
  color: string;
}

interface HighlightSelectorProps {
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

export const HighlightSelector = ({ open, onOpenChange }: HighlightSelectorProps) => {
  const { editor } = useEditor();
  const [hexcolor, setHexColor] = useState<string>('');

  useEffect(() => {
    const initialColor = editor?.getAttributes("highlight")?.color ?? '';
    setHexColor(rgbtoHex(initialColor));
  }, [editor]);

  if (!editor) return null;

  return (
    <Popover modal={true} open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button size="icon" className={
          editor.isActive("highlight") ? "bg-accent" : ""
        } variant="ghost">
          <HighlighterIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        sideOffset={8}
        side="top"
        className="my-1 flex  flex-col gap-2  overflow-y-auto rounded border p-1 shadow-xl overflow-visible"
        align="start"
      >

        <HexColorPicker className="w-full" color={hexcolor} onChange={(color) => {
          setHexColor(color);
          editor.chain().focus().setHighlight({ color }).run();
        }} />

        <div className="flex gap-1 items-center">
          <Input placeholder={!validateHex(hexcolor) ? '#000000' : hexcolor} value={hexcolor} onChange={(e) => {
            const value = e.target.value;
            setHexColor(value);
            if (validateHex(value)) {
              editor.chain().focus().setHighlight({ color: value }).run();
            }
          }} />
          <Button size="icon" className="aspect-square" variant="outline" onClick={() => {
            setHexColor('');
            editor.chain().focus().unsetHighlight().run();
          }}>
            <UndoIcon className="w-3 h-3" />
          </Button>
        </div>

      </PopoverContent>
    </Popover>
  );
};