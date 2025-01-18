import {
    List,
    Code,
    Heading1,
    Heading2,
    Heading3,
    ImageIcon,
    ListTodo,
    ListOrdered,
    Text,
    Quote,
    Minus,
    Book
} from "lucide-react";
import { createSuggestionItems } from "novel/extensions";
import { Command, renderItems } from "novel/extensions";
// import { uploadFn } from "./image-upload";

export const suggestionItems = createSuggestionItems([
    {
        title: "Heading 1",
        description: "Big section heading.",
        searchTerms: ["title", "big", "large"],
        icon: <Heading1 size={16} />,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 1 })
                .run();
        },
    },
    {
        title: "Heading 2",
        description: "Medium section heading.",
        searchTerms: ["subtitle", "medium"],
        icon: <Heading2 size={16} />,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 2 })
                .run();
        },
    },
    {
        title: "Heading 3",
        description: "Small section heading.",
        searchTerms: ["subtitle", "small"],
        icon: <Heading3 size={16} />,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode("heading", { level: 3 })
                .run();
        },
    },
    {
        title: "Text",
        description: "Just start typing with plain text.",
        searchTerms: ["p", "paragraph"],
        icon: <Text size={16} />,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleNode("paragraph", "paragraph")
                .run();
        },
    },
    {
        title: "Bullet List",
        description: "Create a simple bullet list.",
        searchTerms: ["unordered", "point"],
        icon: <List size={16} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
    },
    {
        title: "Numbered List",
        description: "Create a list with numbering.",
        searchTerms: ["ordered"],
        icon: <ListOrdered size={16} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
    },
    {
        title: "Task List",
        description: "Track tasks with a to-do list.",
        searchTerms: ["todo", "task", "list", "check", "checkbox"],
        icon: <ListTodo size={16} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run();
        },
    },
    {
        title: "Blockquote",
        description: "Capture a quote.",
        searchTerms: ["blockquote"],
        icon: <Quote size={16} />,
        command: ({ editor, range }) =>
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleNode("paragraph", "paragraph")
                .toggleBlockquote()
                .run(),
    },
    {
        title: "Code Block",
        description: "Capture a code snippet.",
        searchTerms: ["codeblock"],
        icon: <Code size={16} />,
        command: ({ editor, range }) =>
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },

]);
export const TableItems = createSuggestionItems([


    {
        title: "Image",
        description: "Upload an image from your computer.",
        searchTerms: ["photo", "picture", "media"],
        icon: <ImageIcon size={16} />,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setImageUpload().run();
            // // upload image
            // const input = document.createElement("input");
            // input.type = "file";
            // input.accept = "image/*";
            // input.onchange = async () => {
            //     if (input.files?.length) {
            //         const file = input.files[0];
            //         const pos = editor.view.state.selection.from;
            //         uploadFn(file, editor.view, pos);
            //     }
            // };
            // input.click();
        },
    },
    {
        title: "Horizontal Rule",
        description: "Insert a horizontal divider",
        searchTerms: ["hr"],
        icon: <Minus size={16} />,
        command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
    {
        title: "Table of Contents",
        description: "Insert a horizontal divider",
        searchTerms: ["toc"],
        icon: <Book size={16} />,
        command: ({ editor, range }) => editor.chain().focus().deleteRange(range).insertTableOfContents().run()
    },
]);

export const slashCommand = Command.configure({
    suggestion: {
        items: () => suggestionItems,
        render: renderItems,
    },
});