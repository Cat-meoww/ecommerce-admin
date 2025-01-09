"use client";
import "./prosemirror.css";
import {
    EditorContent, EditorRoot, EditorBubble, EditorCommand,
    EditorCommandItem,
    EditorCommandEmpty,
    EditorCommandList,
    JSONContent
} from "novel";
import { useEffect, useState } from "react";
import { defaultExtensions } from "./extensions";
import { ColorSelector } from "./selectors/color-selector";
import { HighlightSelector } from "./selectors/highlight-selector";
import { Separator } from "@/components/ui/separator";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { TextButtons } from "./selectors/text-buttons";
import { ExtraSelector } from "./selectors/extra-format";
import { handleImageDrop, handleImagePaste } from "novel/plugins";
import { uploadFn } from "./image-upload";
import { slashCommand, suggestionItems } from "./slash-command";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";


const extensions = [...defaultExtensions, slashCommand];
const TailwindEditor = () => {
    const [mount, setMount] = useState(false);
    const [content, setContent] = useState<JSONContent>();
    const [openNode, setOpenNode] = useState(false);
    const [openColor, setOpenColor] = useState(false);
    const [openLink, setOpenLink] = useState(false);
    const [openHighlight, setOpenHighlight] = useState(false);
    const [openExtra, setOpenExtra] = useState(false);

    useEffect(() => {
        setMount(true);
    }, [])
    if (!mount) return null;

    return (
        <EditorRoot >
            <EditorContent
                className="border p-4 rounded-xl min-h-[50vh]"
                extensions={extensions}
                initialContent={content}
                editorProps={{
                    handleDOMEvents: {
                        keydown: (_view, event) => handleCommandNavigation(event),
                    },
                    handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
                    handleDrop: (view, event, _slice, moved) =>
                        handleImageDrop(view, event, moved, uploadFn),
                    attributes: {
                        class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
                    },
                }}
                onUpdate={({ editor }) => {
                    const json = editor.getJSON();
                    setContent(json);
                }}
                slotAfter={<ImageResizer />}
            >
                <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
                    <EditorCommandEmpty className="px-2 text-muted-foreground">
                        No results
                    </EditorCommandEmpty>
                    <EditorCommandList>
                        {suggestionItems.map((item) => (
                            <EditorCommandItem
                                value={item.title}
                                
                                onCommand={(val) => item.command?.(val)}
                                className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                                key={item.title}
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            </EditorCommandItem>
                        ))}
                    </EditorCommandList>
                </EditorCommand>
                <EditorBubble
                    tippyOptions={{
                        placement: "top",
                    }}
                    className='flex w-fit max-w-[90vw] overflow-hidden rounded border border-muted bg-background shadow-xl p-1 gap-0.5'>
                    <Separator orientation="vertical" />
                    <NodeSelector open={openNode} onOpenChange={setOpenNode} />
                    <Separator orientation="vertical" />
                    <TextButtons />
                    <Separator orientation="vertical" />
                    <LinkSelector open={openLink} onOpenChange={setOpenLink} />
                    <Separator orientation="vertical" />
                    <ColorSelector open={openColor} onOpenChange={setOpenColor} />
                    <Separator orientation="vertical" />
                    <HighlightSelector open={openHighlight} onOpenChange={setOpenHighlight} />
                    <ExtraSelector open={openExtra} onOpenChange={setOpenExtra} />
                </EditorBubble>
            </EditorContent>



        </EditorRoot>
    );
};
export default TailwindEditor;
