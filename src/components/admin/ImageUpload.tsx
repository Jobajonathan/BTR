"use client";

import { useState } from "react";
import { uploadMedia } from "@/app/admin/branding/actions";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  previewHeight?: number;
};

export default function ImageUpload({
  value,
  onChange,
  label = "Click to upload image",
  previewHeight = 120
}: Props) {
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { url } = await uploadMedia(fd);
      onChange(url);
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      {value && (
        <div className="upload-preview">
          <img
            src={value}
            alt="Preview"
            height={previewHeight}
            style={{ maxWidth: "100%", borderRadius: 6 }}
          />
          <button
            type="button"
            className="btn-danger"
            onClick={() => onChange("")}
          >
            Remove
          </button>
        </div>
      )}
      <label className="upload-area">
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleChange}
        />
        {uploading ? "Uploading…" : label}
      </label>
    </div>
  );
}
