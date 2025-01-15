
import { useEditor } from '@tiptap/react'
import type { AnyExtension, Editor } from '@tiptap/core'

import type { Doc as YDoc } from 'yjs'

import { ExtensionKit } from '@/components/editor/extensions/extension-kit'
import { initialContent } from '@/components/editor/initialContent'
import { Ai } from '@/components/editor/extensions/Ai'
import { AiImage, AiWriter } from '@/components/editor/extensions'

declare global {
    interface Window {
        editor: Editor | null
    }
}

export const useBlockEditor = ({
    aiToken,
    ydoc,
    provider,
    userId,
    userName = 'Maxi',
}: {
    aiToken?: string
    ydoc: YDoc | null
    provider?: null | undefined
    userId?: string
    userName?: string
}) => {


    const editor = useEditor(
        {
            immediatelyRender: true,
            shouldRerenderOnTransaction: false,
            autofocus: true,
            onCreate: ctx => {

                ctx.editor.commands.setContent(initialContent)
                ctx.editor.commands.focus('start', { scrollIntoView: true })

            },
            extensions: [
                ...ExtensionKit({
                    provider,
                }),
                aiToken
                    ? AiWriter.configure({
                        authorId: userId,
                        authorName: userName,
                    })
                    : undefined,
                aiToken
                    ? AiImage.configure({
                        authorId: userId,
                        authorName: userName,
                    })
                    : undefined,
                aiToken ? Ai.configure({ token: aiToken }) : undefined,
            ].filter((e): e is AnyExtension => e !== undefined),
            editorProps: {
                attributes: {
                    autocomplete: 'off',
                    autocorrect: 'off',
                    autocapitalize: 'off',
                    class: 'min-h-full',
                },
            },
        },
        [ydoc, provider],
    )




    window.editor = editor

    return { editor }
}
