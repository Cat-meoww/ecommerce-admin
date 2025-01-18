import { BubbleMenu as BaseBubbleMenu, Editor, useEditorState } from '@tiptap/react'
import React, { useCallback, useRef } from 'react'
import { Instance, sticky } from 'tippy.js'
import { v4 as uuid } from 'uuid'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"


import { ImageBlockWidth } from './ImageBlockWidth'
import { getRenderContainer } from '@/components/editor/lib/utils'
import { AlignHorizontalDistributeCenterIcon, AlignHorizontalDistributeEndIcon, AlignHorizontalDistributeStartIcon } from 'lucide-react'



export const ImageBlockMenu = ({ editor, appendTo }: {
  editor: Editor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appendTo?: React.RefObject<any>

}): JSX.Element => {
  // const menuRef = useRef<HTMLDivElement>(null)
  const tippyInstance = useRef<Instance | null>(null)

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, 'node-imageBlock')
    const rect = renderContainer?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0)

    return rect
  }, [editor])

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive('imageBlock')
    return isActive
  }, [editor])

  const onAlignImageLeft = useCallback(() => {
    editor.chain().focus(undefined, { scrollIntoView: false }).setImageBlockAlign('left').run()
  }, [editor])

  const onAlignImageCenter = useCallback(() => {
    editor.chain().focus(undefined, { scrollIntoView: false }).setImageBlockAlign('center').run()
  }, [editor])

  const onAlignImageRight = useCallback(() => {
    editor.chain().focus(undefined, { scrollIntoView: false }).setImageBlockAlign('right').run()
  }, [editor])

  const onWidthChange = useCallback(
    (value: number) => {
      editor.chain().focus(undefined, { scrollIntoView: false }).setImageBlockWidth(value).run()
    },
    [editor],
  )
  const { isImageCenter, isImageLeft, isImageRight,
    width } = useEditorState({
      editor,
      selector: ctx => {
        return {
          isImageLeft: ctx.editor.isActive('imageBlock', { align: 'left' }),
          isImageCenter: ctx.editor.isActive('imageBlock', { align: 'center' }),
          isImageRight: ctx.editor.isActive('imageBlock', { align: 'right' }),
          width: parseInt(ctx.editor.getAttributes('imageBlock')?.width || 0),
        }
      },
    })

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`imageBlockMenu-${uuid()}`}
      shouldShow={shouldShow}
      updateDelay={0}
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        getReferenceClientRect,
        onCreate: (instance: Instance) => {
          tippyInstance.current = instance
        },
        appendTo: () => {
          return appendTo?.current
        },
        plugins: [sticky],
        sticky: 'popper',
      }}
    >

      <Menubar>
        <MenubarMenu  >
          <MenubarTrigger data-state="closed"  className={isImageLeft ? "bg-accent" : ''} onClick={onAlignImageLeft}><AlignHorizontalDistributeStartIcon size={16} /></MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger data-state="closed"  className={isImageCenter ? "bg-accent" : ''} onClick={onAlignImageCenter}><AlignHorizontalDistributeCenterIcon size={16} /></MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger data-state="closed" className={isImageRight? "bg-accent" : ''} onClick={onAlignImageRight}><AlignHorizontalDistributeEndIcon size={16} /></MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu data-state="closed">
          <ImageBlockWidth onChange={onWidthChange} value={width} />
        </MenubarMenu>
      </Menubar>
    </BaseBubbleMenu >
  )
}

export default ImageBlockMenu
