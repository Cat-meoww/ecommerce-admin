'use client'
import "./prosemirror.css";
import {
    EditorContent, EditorRoot, EditorBubble,
    EditorCommand,
    EditorCommandItem,
    EditorCommandEmpty,
    EditorCommandList,
    JSONContent,
    type EditorInstance,
} from "novel";
import { useEffect, useState, useRef } from "react";
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
import { useDebouncedCallback } from "use-debounce";
import { slashCommand, suggestionItems, TableItems } from "./slash-command";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import ImageSelector from "./selectors/image-selector";
type EditorProps = {
    data: string | null,
    onChange: (data: string) => void;
}

const extensions = [...defaultExtensions, slashCommand];


const TailwindEditor = ({ data, onChange }: EditorProps) => {
    const [mount, setMount] = useState(false);
    const [content, setContent] = useState<JSONContent>();
    const [openNode, setOpenNode] = useState(false);
    const [openColor, setOpenColor] = useState(false);
    const [openLink, setOpenLink] = useState(false);
    const [openHighlight, setOpenHighlight] = useState(false);
    const [openExtra, setOpenExtra] = useState(false);
    const menuContainerRef = useRef(null)

    const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {
        const json = editor.getJSON();

        onChange(JSON.stringify(json))
    }, 500);

    useEffect(() => {
        setMount(true);
        if (data) {
            setContent(JSON.parse(data) as JSONContent);
        }
    }, [])

    if (!mount) return null;


    return (
        <div className="flex h-full" ref={menuContainerRef}>
            <div className="relative flex flex-col flex-1 h-full overflow-hidden">
                <EditorRoot >
                    <EditorContent
                        className="border p-4 rounded-xl min-h-[50vh]"
                        extensions={extensions}
                        initialContent={content}
                        immediatelyRender={false}
                        editorProps={{
                            handleDOMEvents: {
                                keydown: (_view, event) => handleCommandNavigation(event),
                            },
                            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
                            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
                            attributes: {
                                class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
                            },
                        }}
                        onUpdate={({ editor }) => {
                            debouncedUpdates(editor)
                        }}
                        slotAfter={<ImageResizer />}
                    >
                        <EditorCommand className="max-w-64 w-[1000vw] z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
                            <EditorCommandEmpty className="px-2 text-muted-foreground">
                                No results
                            </EditorCommandEmpty>

                            <EditorCommandList className="grid grid-cols-1 gap-0.5" >
                                {/* <div className="grid grid-cols-1 gap-0.5"> */}


                                {/* <div className="text-neutral-500 text-[0.65rem] col-[1/-1] mx-2 mt-4 font-semibold tracking-wider select-none uppercase first:mt-0.5">
                                AI
                            </div>
                            <div className="text-neutral-500 text-[0.65rem] col-[1/-1] mx-2 mt-4 font-semibold tracking-wider select-none uppercase first:mt-0.5">
                                Formate
                            </div> */}
                                {suggestionItems.map((item) => (
                                    <EditorCommandItem
                                        value={item.title}
                                        onCommand={(val) => item.command?.(val)}
                                        className={`flex w-full items-center space-x-2  px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-900   gap-2 p-1.5 font-medium text-neutral-500 dark:text-neutral-400 bg-transparent  rounded hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-neutral-200`}
                                        key={item.title}
                                    >
                                        {item.icon}

                                        {item.title}
                                    </EditorCommandItem>
                                ))}
                                {/* <div className="text-neutral-500 text-[0.65rem] col-[1/-1] mx-2 mt-4 font-semibold tracking-wider select-none uppercase first:mt-0.5">
                                Insert
                            </div> */}
                                {TableItems.map((item) => (
                                    <EditorCommandItem
                                        value={item.title}
                                        onCommand={(val) => item.command?.(val)}
                                        className={`flex w-full items-center space-x-2  px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-900   gap-2 p-1.5 font-medium text-neutral-500 dark:text-neutral-400 bg-transparent  rounded hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-900 dark:hover:text-neutral-200`}
                                        key={item.title}
                                    >
                                        {item.icon}

                                        {item.title}
                                    </EditorCommandItem>
                                ))}
                                {/* </div> */}
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
                            <ImageSelector container={menuContainerRef} />
                        </EditorBubble>
                    </EditorContent>
                </EditorRoot>
            </div>
        </div>

    );
};
export default TailwindEditor;
