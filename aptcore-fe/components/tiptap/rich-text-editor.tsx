'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MenuBar from './menu-bar'
import TextAlign from '@tiptap/extension-text-align'
import { useEffect } from 'react'

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void
  disabled: boolean
}

export default function RichTextEditor({ value, onChange, disabled }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: { class: 'list-disc ml-3' },
        },
        orderedList: {
          HTMLAttributes: { class: 'list-decimal ml-3' },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          'min-h-[156px] border rounded-b-md bg-slate-50 py-2 px-3 dark:bg-zinc-800',
      },
    },
  })

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled)
    }
  }, [disabled, editor])

  return (
    <>
      <div data-role="editor">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} className="tiptap text-dark dark:text-white"/>
      </div>
    </>
  )
}