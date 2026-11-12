'use client'

import { Editor } from '@tiptap/react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import React from 'react'

function EditorToggle({
  editor,
  isActive,
  onClick,
  children,
}: {
  editor: Editor
  isActive: () => boolean
  onClick: () => void
  children: React.ReactNode
}) {
  const [active, setActive] = React.useState(isActive())

  React.useEffect(() => {
    const update = () => setActive(isActive())
    editor.on('selectionUpdate', update)
    editor.on('transaction', update)
    return () => {
      editor.off('selectionUpdate', update)
      editor.off('transaction', update)
    }
  }, [editor, isActive])

  return (
    <Toggle pressed={active} onClick={onClick}>
      {children}
    </Toggle>
  )
}

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  return (
    <div className="border rounded-t-md p-1 mb-0 bg-slate-100 dark:bg-slate-800 flex flex-wrap gap-2 z-50">
      <EditorToggle
        editor={editor}
        isActive={() => editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className="size-4" />
      </EditorToggle>
      <EditorToggle
        editor={editor}
        isActive={() => editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="size-4" />
      </EditorToggle>
      <EditorToggle
        editor={editor}
        isActive={() => editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="size-4" />
      </EditorToggle>
      <EditorToggle
        editor={editor}
        isActive={() => editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </EditorToggle>
      <EditorToggle
        editor={editor}
        isActive={() => editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </EditorToggle>
      <EditorToggle
        editor={editor}
        isActive={() => editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="size-4" />
      </EditorToggle>
      <EditorToggle
        editor={editor}
        isActive={() => editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="size-4" />
      </EditorToggle>
      <EditorToggle
        editor={editor}
        isActive={() => editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft className="size-4" />
      </EditorToggle>
      <EditorToggle
        editor={editor}
        isActive={() => editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter className="size-4" />
      </EditorToggle>
      <EditorToggle
        editor={editor}
        isActive={() => editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight className="size-4" />
      </EditorToggle>
      <EditorToggle
        editor={editor}
        isActive={() => editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </EditorToggle>
      <EditorToggle
        editor={editor}
        isActive={() => editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </EditorToggle>
    </div>
  )
}
