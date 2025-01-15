import { EditorContent } from '@tiptap/react'
import React, { useRef } from 'react'


import { useBlockEditor } from './hooks/useBlockEditor'

import './styles/index.css'



import * as Y from 'yjs'
import ImageBlockMenu from './extensions/ImageBlock/components/ImageBlockMenu'
import { ContentItemMenu, LinkMenu, TextMenu } from './menus'
import { ColumnsMenu } from './extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from './extensions/Table/menus'

export const BlockEditor = ({
    aiToken,
    ydoc,
}: {
    aiToken?: string
    ydoc: Y.Doc | null
}) => {
    const menuContainerRef = useRef(null)


    const { editor } = useBlockEditor({ aiToken, ydoc })

    if (!editor) {
        return null
    }

    return (
        <div className="flex h-full" ref={menuContainerRef}>
            <div className="relative flex flex-col flex-1 h-full overflow-hidden">

                <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
                <ContentItemMenu editor={editor} />
                {/* <LinkMenu editor={editor} appendTo={menuContainerRef} />
                <TextMenu editor={editor} />
                <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
                <TableRowMenu editor={editor} appendTo={menuContainerRef} />
                <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
                <ImageBlockMenu editor={editor} appendTo={menuContainerRef} /> */}
            </div>
        </div>
    )
}

export default BlockEditor
