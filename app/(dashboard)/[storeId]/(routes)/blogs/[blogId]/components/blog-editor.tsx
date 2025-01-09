"use client";
import "./prosemirror.css";
import { EditorContent, EditorRoot, JSONContent } from "novel";
import { useState } from "react";
import { defaultExtensions } from "../../../../../../../components/editor/extensions";
// import {  } from 'novel/extensions'


const extensions = [...defaultExtensions];
const TailwindEditor = () => {
    const [content, setContent] = useState<JSONContent>();
    return (
        <EditorRoot >
            <EditorContent
                className="border p-4 rounded-xl"
                extensions={extensions}
                initialContent={content}
                onUpdate={({ editor }) => {
                    const json = editor.getJSON();
                    setContent(json);
                }}
            />
        </EditorRoot>
    );
};
export default TailwindEditor;
