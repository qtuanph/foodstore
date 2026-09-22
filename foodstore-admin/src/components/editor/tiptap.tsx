"use client"
"use no memo"

import * as React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Image from "@tiptap/extension-image"
import LinkExtension from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import Color from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import FontFamily from "@tiptap/extension-font-family"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { Table } from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import { common, createLowlight } from "lowlight"
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, List, ListOrdered,
  Quote, Heading1, Heading2, Heading3, Undo, Redo, ImageIcon, LinkIcon,
  AlignLeft, AlignCenter, AlignRight, Highlighter, Upload, Pilcrow, Minus,
  CodeSquare, TableIcon, Palette, Type,
} from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const lowlight = createLowlight(common)

const FONT_FAMILIES = [
  { label: "Mặc định", value: "" },
  { label: "Arial", value: "Arial" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Courier New", value: "Courier New" },
  { label: "Verdana", value: "Verdana" },
]

const TEXT_COLORS = [
  { label: "Mặc định", value: "" },
  { label: "Đen", value: "#000000" },
  { label: "Đỏ", value: "#ef4444" },
  { label: "Cam", value: "#f97316" },
  { label: "Vàng", value: "#eab308" },
  { label: "Xanh lá", value: "#22c55e" },
  { label: "Xanh dương", value: "#3b82f6" },
  { label: "Tím", value: "#a855f7" },
  { label: "Hồng", value: "#ec4899" },
  { label: "Xám", value: "#6b7280" },
]

interface TiptapProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

function ToolbarButton({
  onClick,
  pressed,
  disabled,
  children,
  title,
}: {
  onClick: () => void
  pressed?: boolean
  disabled?: boolean
  children: React.ReactNode
  title?: string
}) {
  return (
    <Toggle
      pressed={pressed}
      onPressedChange={() => onClick()}
      disabled={disabled}
      size="sm"
      title={title}
    >
      {children}
    </Toggle>
  )
}

export function Tiptap({ content, onChange, placeholder }: TiptapProps) {
  const [mounted, setMounted] = React.useState(false)
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState("")
  const [uploading, setUploading] = React.useState(false)
  const [linkDialogOpen, setLinkDialogOpen] = React.useState(false)
  const [linkUrl, setLinkUrl] = React.useState("")

  React.useEffect(() => setMounted(true), [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: false,
        codeBlock: false,
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      Image.configure({ inline: false }),
      LinkExtension.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Bắt đầu viết nội dung..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CodeBlockLowlight.configure({ lowlight }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    setUploading(true)
    try {
      const { mediaService } = await import("@/lib/services/media-service")
      const result = await mediaService.upload(file, "blog")
      editor.chain().focus().setImage({ src: result.fileUrl }).run()
      setImageDialogOpen(false)
    } catch {
      alert("Upload thất bại")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const handleInsertImageUrl = () => {
    if (!imageUrl.trim() || !editor) return
    editor.chain().focus().setImage({ src: imageUrl.trim() }).run()
    setImageUrl("")
    setImageDialogOpen(false)
  }

  const handleInsertLink = () => {
    if (!linkUrl.trim() || !editor) return
    const href = linkUrl.trim().startsWith("http") ? linkUrl.trim() : `https://${linkUrl.trim()}`
    editor.chain().focus().setLink({ href }).run()
    setLinkUrl("")
    setLinkDialogOpen(false)
  }

  if (!mounted || !editor) {
    return (
      <div className="border rounded-lg p-4 min-h-[300px]">
        <p className="text-muted-foreground text-sm">Đang tải trình soạn thảo...</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Row 1: Text formatting */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b bg-muted/30">
        <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} pressed={editor.isActive("paragraph")} title="Đoạn văn">
          <Pilcrow className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} pressed={editor.isActive("heading", { level: 1 })} title="Heading 1">
          <Heading1 className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} pressed={editor.isActive("heading", { level: 2 })} title="Heading 2">
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} pressed={editor.isActive("heading", { level: 3 })} title="Heading 3">
          <Heading3 className="size-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} pressed={editor.isActive("bold")} title="In đậm">
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} pressed={editor.isActive("italic")} title="In nghiêng">
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} pressed={editor.isActive("underline")} title="Gạch chân">
          <UnderlineIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} pressed={editor.isActive("strike")} title="Gạch ngang">
          <Strikethrough className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} pressed={editor.isActive("code")} title="Code inline">
          <Code className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} pressed={editor.isActive("highlight")} title="Highlight">
          <Highlighter className="size-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Font Family */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />} title="Font">
            <Type className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {FONT_FAMILIES.map((f) => (
              <DropdownMenuItem
                key={f.value}
                onClick={() => editor.chain().focus().setFontFamily(f.value).run()}
                style={{ fontFamily: f.value || "inherit" }}
              >
                {f.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Text Color */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />} title="Màu chữ">
            <Palette className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {TEXT_COLORS.map((c) => (
              <DropdownMenuItem
                key={c.value}
                onClick={() => editor.chain().focus().setColor(c.value).run()}
              >
                <span className="mr-2 inline-block size-3 rounded-full border" style={{ background: c.value || "transparent" }} />
                {c.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Row 2: Blocks, lists, alignment, insert */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b bg-muted/30">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} pressed={editor.isActive("bulletList")} title="Danh sách không thứ tự">
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} pressed={editor.isActive("orderedList")} title="Danh sách có thứ tự">
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} pressed={editor.isActive("blockquote")} title="Trích dẫn">
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} pressed={editor.isActive("codeBlock")} title="Code block">
          <CodeSquare className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Đường kẻ ngang">
          <Minus className="size-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} pressed={editor.isActive({ textAlign: "left" })} title="Căn trái">
          <AlignLeft className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} pressed={editor.isActive({ textAlign: "center" })} title="Căn giữa">
          <AlignCenter className="size-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} pressed={editor.isActive({ textAlign: "right" })} title="Căn phải">
          <AlignRight className="size-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Table */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />} title="Bảng">
            <TableIcon className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
              Chèn bảng 3x3
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 4, cols: 4, withHeaderRow: true }).run()}>
              Chèn bảng 4x4
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run()}>
              Chèn bảng 2x2
            </DropdownMenuItem>
            {editor.isActive("table") && (
              <>
                <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>Thêm cột sau</DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>Thêm hàng sau</DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>Xóa cột</DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>Xóa hàng</DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()}>Xóa bảng</DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().mergeCells().run()}>Gộp ô</DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().splitCell().run()}>Tách ô</DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeaderRow().run()}>Toggle header</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Image */}
        <Dialog open={imageDialogOpen} onOpenChange={(v) => { setImageDialogOpen(v); if (!v) setImageUrl("") }}>
          <DialogTrigger render={<Button variant="ghost" size="icon-sm" />} title="Thêm ảnh">
            <ImageIcon className="size-4" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Thêm ảnh</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Upload từ máy tính</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="relative" disabled={uploading}>
                    <Upload className="size-4 mr-1" />{uploading ? "Đang tải..." : "Chọn file"}
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUploadImage} disabled={uploading} />
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><Separator className="w-full" /></div>
                <div className="relative flex justify-center"><span className="bg-background px-2 text-xs text-muted-foreground">hoặc nhập URL</span></div>
              </div>
              <div className="grid gap-2">
                <Label>URL ảnh</Label>
                <div className="flex gap-2">
                  <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
                  <Button onClick={handleInsertImageUrl} disabled={!imageUrl.trim()}>Thêm</Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Link */}
        <Dialog open={linkDialogOpen} onOpenChange={(v) => { setLinkDialogOpen(v); if (!v) setLinkUrl("") }}>
          <DialogTrigger render={<Button variant="ghost" size="icon-sm" />} title="Thêm link">
            <LinkIcon className="size-4" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Thêm liên kết</DialogTitle></DialogHeader>
            <div className="flex gap-2">
              <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
              <Button onClick={handleInsertLink} disabled={!linkUrl.trim()}>Thêm</Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="ml-auto flex gap-0.5">
          <Button variant="ghost" size="icon-sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Hoàn tác">
            <Undo className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Làm lại">
            <Redo className="size-4" />
          </Button>
        </div>
      </div>

      <EditorContent
        editor={editor}
        className="p-4 min-h-[400px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[400px]"
      />
    </div>
  )
}
