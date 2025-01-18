'use client'
import {
    TiptapImage,
    TiptapLink,
    // UpdatedImage,
    TaskList,
    TaskItem,
    HorizontalRule,
    StarterKit,
    Placeholder,
    AIHighlight,
    TiptapUnderline,
    Color,
    TextStyle,
    CodeBlockLowlight,
    HighlightExtension,
    GlobalDragHandle,
} from "novel/extensions";


import Subscript from '@tiptap/extension-subscript'

import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Focus from '@tiptap/extension-focus'
import { createLowlight, common } from 'lowlight'
import { UploadImagesPlugin } from "novel/plugins";

import { cx } from "class-variance-authority";
import { ImageBlock } from "./components/ImageBlock";
import { ImageUpload } from "./components/ImageUpload";
import TableOfContents from "@tiptap-pro/extension-table-of-contents";
import { TableOfContentsNode } from "./components/TableOfContentsNode";

const aiHighlight = AIHighlight;
const PlaceholderExtension = Placeholder.configure({
    includeChildren: true,
    showOnlyCurrent: false,
    placeholder: ({ node }) => {
        if (node.type.name === "heading") {
            return `Heading ${node.attrs.level}`;
        }
        return "Click here to start writing …";
    },
});
const tiptapLink = TiptapLink.configure({
    HTMLAttributes: {
        class: cx(
            "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer",
        ),
    },
});

const tiptapImage = TiptapImage.extend({
    addProseMirrorPlugins() {
        return [
            UploadImagesPlugin({
                imageClass: cx("opacity-40 rounded-lg border border-stone-200"),
            }),
        ];
    },
}).configure({
    allowBase64: true,
    HTMLAttributes: {
        class: cx("rounded-lg border border-muted"),
    },
});

// const updatedImage = UpdatedImage.configure({
//     HTMLAttributes: {
//         class: cx("rounded-lg border border-muted"),
//     },
// });

const taskList = TaskList.configure({
    HTMLAttributes: {
        class: cx("not-prose pl-2 "),
    },
});
const taskItem = TaskItem.configure({
    HTMLAttributes: {
        class: cx("flex gap-2 items-start my-4"),
    },
    nested: true,
});

const horizontalRule = HorizontalRule.configure({
    HTMLAttributes: {
        class: cx("mt-4 mb-6 border-t border-muted-foreground"),
    },
});

const starterKit = StarterKit.configure({
    bulletList: {
        HTMLAttributes: {
            class: cx("list-disc list-outside leading-3 -mt-2"),
        },
    },
    orderedList: {
        HTMLAttributes: {
            class: cx("list-decimal list-outside leading-3 -mt-2"),
        },
    },
    listItem: {
        HTMLAttributes: {
            class: cx("leading-normal -mb-2"),
        },
    },
    blockquote: {
        HTMLAttributes: {
            class: cx("border-l-4 border-primary"),
        },
    },
    codeBlock: {
        HTMLAttributes: {
            class: cx(
                "rounded-md bg-muted text-muted-foreground border p-5 font-mono font-medium",
            ),
        },
    },
    code: {
        HTMLAttributes: {
            class: cx("rounded-md bg-muted  px-1.5 py-1 font-mono font-medium"),
            spellcheck: "false",
        },
    },
    horizontalRule: false,
    dropcursor: {
        color: "#DBEAFE",
        width: 4,
    },
    gapcursor: false,
});

const codeBlockLowlight = CodeBlockLowlight.configure({
    // configure lowlight: common /  all / use highlightJS in case there is a need to specify certain language grammars only
    // common: covers 37 language grammars which should be good enough in most cases
    lowlight: createLowlight(common),
});


export const defaultExtensions = [
    starterKit,
    PlaceholderExtension,
    tiptapLink,
    tiptapImage,
    // updatedImage,
    taskList,
    taskItem,
    horizontalRule,
    aiHighlight,
    TiptapUnderline,
    Color,
    Focus,
    ImageUpload,
    ImageBlock,
    TextStyle.configure({
        mergeNestedSpanStyles: true
    }),
    Subscript,
    Superscript,
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    codeBlockLowlight,
    HighlightExtension.configure({
        multicolor: true,
    }),
    GlobalDragHandle.configure({
        HTMLAttributes: {
            class: cx("border border-primary rounded-md w-8 h-8 bg-red"),
        },
    }),
    TableOfContents,
    TableOfContentsNode


];