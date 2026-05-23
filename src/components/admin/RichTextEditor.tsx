"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { useEffect, useState, useRef } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

/* ── Small helpers ───────────────────────────────────────────── */

function Btn({
  active,
  disabled,
  title,
  onClick,
  children
}: {
  active?: boolean;
  disabled?: boolean;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`re-btn${active ? " is-active" : ""}${disabled ? " is-disabled" : ""}`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="re-sep" aria-hidden="true" />;
}

/* ── Main component ──────────────────────────────────────────── */

export default function RichTextEditor({ value, onChange, placeholder = "Start writing…" }: Props) {
  const [linkPanelOpen, setLinkPanelOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({ inline: false, allowBase64: true }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" }
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Highlight.configure({ multicolor: false }),
      CharacterCount,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Subscript,
      Superscript
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: { spellcheck: "true" }
    }
  });

  /* Sync external value changes (e.g. duplicate/load) */
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  /* Auto-focus link input when panel opens */
  useEffect(() => {
    if (linkPanelOpen) setTimeout(() => linkInputRef.current?.focus(), 40);
  }, [linkPanelOpen]);

  if (!editor) return null;

  /* ── Link helpers ── */
  function openLinkPanel() {
    setLinkUrl(editor.getAttributes("link").href ?? "");
    setLinkPanelOpen(true);
  }

  function applyLink() {
    const url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
    setLinkPanelOpen(false);
    setLinkUrl("");
  }

  function handleLinkKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); applyLink(); }
    if (e.key === "Escape") setLinkPanelOpen(false);
  }

  /* ── Insert helpers ── */
  function insertImage() {
    const url = window.prompt("Image URL (or paste a Supabase storage URL):");
    if (url?.trim()) editor.chain().focus().setImage({ src: url.trim() }).run();
  }

  function insertTable() {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  /* ── Stats ── */
  const words = editor.storage.characterCount?.words() ?? 0;
  const chars = editor.storage.characterCount?.characters() ?? 0;
  const readMins = Math.max(1, Math.ceil(words / 200));

  const inTable = editor.isActive("table");

  /* ── Render ── */
  return (
    <div className="rich-editor">

      {/* ══ Toolbar ══════════════════════════════════════════════ */}
      <div className="re-toolbar" role="toolbar" aria-label="Text editor toolbar">

        {/* History */}
        <Btn title="Undo (Ctrl+Z)" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>↩</Btn>
        <Btn title="Redo (Ctrl+Y)" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>↪</Btn>
        <Sep />

        {/* Block type */}
        <Btn title="Paragraph" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>¶</Btn>
        <Btn title="Heading 1 — page title" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</Btn>
        <Btn title="Heading 2 — section" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Btn>
        <Btn title="Heading 3 — sub-section" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Btn>
        <Btn title="Heading 4 — minor heading" active={editor.isActive("heading", { level: 4 })} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>H4</Btn>
        <Sep />

        {/* Inline formatting */}
        <Btn title="Bold (Ctrl+B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></Btn>
        <Btn title="Italic (Ctrl+I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></Btn>
        <Btn title="Underline (Ctrl+U)" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></Btn>
        <Btn title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></Btn>
        <Btn title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>{"</>"}</Btn>
        <Btn title="Highlight" active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight().run()}>▌</Btn>
        <Btn title="Subscript (e.g. H₂O)" active={editor.isActive("subscript")} onClick={() => editor.chain().focus().toggleSubscript().run()}>x₂</Btn>
        <Btn title="Superscript (e.g. x²)" active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()}>x²</Btn>
        <Btn title="Clear all formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>✕ fmt</Btn>
        <Sep />

        {/* Alignment */}
        <Btn title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>⬤L</Btn>
        <Btn title="Align centre" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>⬤C</Btn>
        <Btn title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>⬤R</Btn>
        <Btn title="Justify" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>⬤J</Btn>
        <Sep />

        {/* Lists */}
        <Btn title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</Btn>
        <Btn title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</Btn>
        <Sep />

        {/* Block elements */}
        <Btn title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</Btn>
        <Btn title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{ } Block</Btn>
        <Btn title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>— Rule</Btn>
        <Sep />

        {/* Links & media */}
        <Btn title="Insert / edit link" active={editor.isActive("link")} onClick={openLinkPanel}>🔗 Link</Btn>
        <Btn title="Remove link" disabled={!editor.isActive("link")} onClick={() => editor.chain().focus().unsetLink().run()}>Unlink</Btn>
        <Btn title="Insert image by URL" onClick={insertImage}>🖼 Image</Btn>
        <Btn title="Insert 3×3 table" onClick={insertTable}>⊞ Table</Btn>
      </div>

      {/* ══ Link panel ═══════════════════════════════════════════ */}
      {linkPanelOpen && (
        <div className="re-link-panel">
          <span className="re-link-label">URL:</span>
          <input
            ref={linkInputRef}
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={handleLinkKey}
            placeholder="https://"
            className="re-link-input"
          />
          <button type="button" className="re-link-apply" onClick={applyLink}>Apply</button>
          <button type="button" className="re-link-cancel" onClick={() => setLinkPanelOpen(false)}>Cancel</button>
          <span className="re-link-hint">Enter to apply · Esc to close · Leave blank to remove link</span>
        </div>
      )}

      {/* ══ Table toolbar (contextual) ═══════════════════════════ */}
      {inTable && (
        <div className="re-table-toolbar">
          <span className="re-table-label">Table:</span>
          <button type="button" className="re-tbtn" onClick={() => editor.chain().focus().addColumnBefore().run()}>+ Col ←</button>
          <button type="button" className="re-tbtn" onClick={() => editor.chain().focus().addColumnAfter().run()}>+ Col →</button>
          <button type="button" className="re-tbtn" onClick={() => editor.chain().focus().addRowBefore().run()}>+ Row ↑</button>
          <button type="button" className="re-tbtn" onClick={() => editor.chain().focus().addRowAfter().run()}>+ Row ↓</button>
          <button type="button" className="re-tbtn" onClick={() => editor.chain().focus().toggleHeaderRow().run()}>Toggle header</button>
          <button type="button" className="re-tbtn" onClick={() => editor.chain().focus().mergeCells().run()}>Merge</button>
          <button type="button" className="re-tbtn" onClick={() => editor.chain().focus().splitCell().run()}>Split</button>
          <span className="re-table-sep" />
          <button type="button" className="re-tbtn re-tbtn-danger" onClick={() => editor.chain().focus().deleteColumn().run()}>Del col</button>
          <button type="button" className="re-tbtn re-tbtn-danger" onClick={() => editor.chain().focus().deleteRow().run()}>Del row</button>
          <button type="button" className="re-tbtn re-tbtn-danger" onClick={() => editor.chain().focus().deleteTable().run()}>Del table</button>
        </div>
      )}

      {/* ══ Content ══════════════════════════════════════════════ */}
      <EditorContent editor={editor} />

      {/* ══ Footer stats ═════════════════════════════════════════ */}
      <div className="re-footer">
        <span>{words.toLocaleString()} {words === 1 ? "word" : "words"}</span>
        <span className="re-footer-dot">·</span>
        <span>~{readMins} min read</span>
        <span className="re-footer-dot">·</span>
        <span>{chars.toLocaleString()} chars</span>
      </div>
    </div>
  );
}
