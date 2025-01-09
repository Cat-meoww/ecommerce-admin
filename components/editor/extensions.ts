'use client'
import {
    TiptapImage,
    TiptapLink,
    UpdatedImage,
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
} from "novel/extensions";
import Subscript from '@tiptap/extension-subscript'
import Text from '@tiptap/extension-text'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'

import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { createLowlight } from 'lowlight'
import { UploadImagesPlugin } from "novel/plugins";

import { cx } from "class-variance-authority";

const aiHighlight = AIHighlight;
const placeholder = Placeholder.configure({
    placeholder: ({ node }) => {
        if (node.type.name === "heading") {
            return `Heading ${node.attrs.level}`;
        }
        return "Type / to browse options";
    },
    includeChildren: true,
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

const updatedImage = UpdatedImage.configure({
    HTMLAttributes: {
        class: cx("rounded-lg border border-muted"),
    },
});

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

const lowlight = createLowlight()
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

export const defaultExtensions = [
    starterKit,
    placeholder,
    tiptapLink,
    tiptapImage,
    updatedImage,
    taskList,
    taskItem,
    horizontalRule,
    aiHighlight,
    Text,
    TiptapUnderline,
    Color,
    TextStyle.configure({
        mergeNestedSpanStyles: true
    }),
    Subscript,
    Superscript,
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    CodeBlockLowlight.configure({
        lowlight: lowlight,
    }),
    HighlightExtension.configure({
        multicolor: true,
    }),
];