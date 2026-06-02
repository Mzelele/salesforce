"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  emoji?: string;
  parent?: { _id: string; name: string } | null;
  deletedAt?: string;
  position?: number;
}

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  emoji: "",
  parent: "none",
};

type ThumbnailMode = "image" | "icon";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [thumbnailMode, setThumbnailMode] = useState<ThumbnailMode>("image");

  // Collapse state for tree
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [allOpen, setAllOpen] = useState<boolean>(true);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // default-open parent categories whenever categories change
  useEffect(() => {
    const opens: Record<string, boolean> = {};
    for (const c of categories) {
      if (categories.some((ch) => (ch.parent?._id?.toString() || null) === c._id)) {
        opens[c._id] = true;
      }
    }
    // if user hasn't toggled global state, keep defaults; otherwise respect allOpen
    if (allOpen) setOpenMap((m) => ({ ...opens, ...m }));
    else setOpenMap((m) => ({ ...m }));
  }, [categories]);

  const toggleAll = () => {
    if (allOpen) {
      // collapse all
      setOpenMap({});
      setAllOpen(false);
    } else {
      // expand all parents which have children
      const opens: Record<string, boolean> = {};
      for (const c of categories) {
        if (categories.some((ch) => (ch.parent?._id?.toString() || null) === c._id)) {
          opens[c._id] = true;
        }
      }
      setOpenMap(opens);
      setAllOpen(true);
    }
  }


  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setSlugManuallyEdited(false);
    setThumbnailMode("image");
  };

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .trim()
      .replace(/[''']/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: slugManuallyEdited ? prev.slug : generateSlug(name),
    }));
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed");
      }

      setForm((prev) => ({ ...prev, image: data.url }));
      setThumbnailMode("image");
      toast.success("Category image uploaded");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async () => {
    const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";

    const res = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        image: thumbnailMode === "image" ? form.image.trim() : "",
        emoji: thumbnailMode === "icon" ? form.emoji.trim() : "",
        parent: form.parent === "none" ? null : form.parent,
      }),
    });

    if (res.ok) {
      toast.success(editingId ? "Category updated" : "Category created");
      resetForm();
      fetchCategories();
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed to save category");
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat._id);
    setSlugManuallyEdited(true);
    setThumbnailMode(cat.image ? "image" : "icon");
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "",
      emoji: cat.emoji || "",
      parent: cat.parent?._id?.toString() || "none",
    });
  };

  const handleDelete = async (cat: Category) => {
    const isDeleted = !!cat.deletedAt;
    if (isDeleted) {
      if (!confirm("Permanently delete this category? This cannot be undone.")) return;
      const res = await fetch(`/api/admin/categories/${cat._id}?permanent=true`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Category permanently deleted");
        fetchCategories();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to delete");
      }
      return;
    }

    const archive = confirm("Move this category to trash? Press Cancel to permanently delete instead.");
    if (archive) {
      const res = await fetch(`/api/admin/categories/${cat._id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Category moved to trash");
        fetchCategories();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to delete");
      }
    } else {
      if (!confirm("Permanently delete this category? This cannot be undone.")) return;
      const res = await fetch(`/api/admin/categories/${cat._id}?permanent=true`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Category permanently deleted");
        fetchCategories();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to delete");
      }
    }
  };

  // Build children map for simple nested display
  const childrenMap: Record<string, Category[]> = {};
  categories.forEach((c) => {
    const pid = c.parent?._id?.toString() || "root";
    if (!childrenMap[pid]) childrenMap[pid] = [];
    childrenMap[pid].push(c);
  });

  const sortByPosition = (arr: Category[] = []) => arr.slice().sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  const toggleOpen = (id: string) => {
    setOpenMap((m) => ({ ...m, [id]: !m[id] }));
  };

  const renderNode = (node: Category, level = 0) => {
    const children = sortByPosition(childrenMap[node._id] || []);
    const isOpen = !!openMap[node._id];
    return (
      <>
        <tr key={node._id} className={`border-b border-neutral-700 ${node.deletedAt ? "opacity-50" : ""}`}>
          <td className="px-4 py-3 align-top">
            <div className="relative h-8 w-8 overflow-hidden rounded border border-neutral-700 bg-neutral-900">
              {node.image ? (
                <Image src={node.image} alt={node.name} fill className="object-cover" unoptimized />
              ) : node.emoji ? (
                <div className="flex h-full w-full items-center justify-center text-sm">{node.emoji}</div>
              ) : null}
            </div>
          </td>
          <td className="px-4 py-3 text-sm font-semibold text-neutral-100">
            <div className="flex items-center gap-2">
              <div style={{ paddingLeft: `${level * 1.25}rem` }} className="flex items-center gap-2">
                {children.length > 0 ? (
                  <button
                    onClick={() => toggleOpen(node._id)}
                    aria-expanded={isOpen}
                    className="rounded p-1 text-neutral-300 hover:bg-neutral-800"
                  >
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                ) : (
                  <span style={{ width: 24 }} />
                )}
                <span className={level > 0 ? "text-neutral-400" : "text-neutral-100"}>{node.name}</span>
                {children.length > 0 && (
                  <span className="ml-2 text-xs text-neutral-400">({children.length})</span>
                )}
                {node.deletedAt && (
                  <span className="inline-flex rounded-full bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-400">Deleted</span>
                )}
              </div>
            </div>
          </td>
          <td className="px-4 py-3 text-neutral-400">{node.slug}</td>
          <td className="px-4 py-3 text-neutral-400">{node.parent?.name || "-"}</td>
          <td className="px-4 py-3 text-right">
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(node)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(node)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </td>
        </tr>
        {children.length > 0 && isOpen && children.map((ch) => renderNode(ch, level + 1))}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Categories</h1>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
        <h3 className="mb-3 font-semibold dark:text-white">{editingId ? "Edit Category" : "Add Category"}</h3>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Category name"
            />
          </div>
          <div>
            <Label>Slug</Label>
            <div className="flex gap-2">
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  setForm((p) => ({ ...p, slug: e.target.value }));
                }}
                placeholder="auto-generated"
              />
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => {
                  setSlugManuallyEdited(false);
                  setForm((prev) => ({ ...prev, slug: generateSlug(prev.name) }));
                }}
              >
                Auto
              </Button>
            </div>
          </div>
          <div>
            <Label>Parent</Label>
            <Select value={form.parent} onValueChange={(v) => setForm((p) => ({ ...p, parent: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="None (top level)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No parent category</SelectItem>
                {categories
                  .filter((c) => c._id !== editingId)
                  .map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Optional description"
            />
          </div>
          <div className="lg:col-span-2">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Label className="!mb-0">Thumbnail</Label>
                <div className="flex gap-2">
                  {[{ mode: "image", label: "Image" }, { mode: "icon", label: "Icon" }].map(({ mode, label }) => (
                    <button
                      key={mode}
                      type="button"
                      className={clsx(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                        thumbnailMode === mode ? "border-neutral-900 bg-neutral-900/5 text-neutral-900 dark:border-neutral-50 dark:text-neutral-50" : "border-neutral-200 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 dark:border-neutral-700"
                      )}
                      onClick={() => setThumbnailMode(mode)}
                      aria-pressed={thumbnailMode === mode}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex-none">
                  <div className="relative h-16 w-16 overflow-hidden rounded border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
                    {thumbnailMode === "image" && form.image ? (
                      <>
                        <Image src={form.image} alt="Category thumbnail preview" fill className="object-cover" unoptimized />
                        <button
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, image: "" }))}
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                          aria-label="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </>
                    ) : thumbnailMode === "icon" && form.emoji ? (
                      <div className="flex h-full w-full items-center justify-center text-2xl">{form.emoji}</div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-wide text-neutral-500">{thumbnailMode === "image" ? "No image" : "No icon"}</div>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-[220px] space-y-2">
                  {thumbnailMode === "image" ? (
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Upload image</Label>
                      <Input type="file" accept="image/*" disabled={uploadingImage} onChange={handleImageUpload} />
                      {uploadingImage && <p className="text-xs text-neutral-500">Uploading...</p>}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Emoji icon</Label>
                      <Input
                        value={form.emoji}
                        onChange={(e) => {
                          setForm((p) => ({ ...p, emoji: e.target.value }));
                          setThumbnailMode("icon");
                        }}
                        placeholder="e.g. 🪴"
                        maxLength={3}
                      />
                      <p className="text-xs text-neutral-500">Use an emoji to represent the category.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Button onClick={handleSubmit}>
            <Plus className="mr-1 h-4 w-4" />
            {editingId ? "Update" : "Add"} Category
          </Button>
          {editingId && (
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleAll}>
            {allOpen ? 'Collapse all' : 'Expand all'}
          </Button>
          <div className="text-sm text-neutral-400">{categories.length} total</div>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700">
                <th className="px-4 py-3 text-left font-medium">Preview</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium dark:text-white">Slug</th>
                <th className="px-4 py-3 text-left font-medium dark:text-white">Parent</th>
                <th className="px-4 py-3 text-right font-medium dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><Skeleton className="h-10 w-10 rounded-full" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-4 py-3"><Skeleton className="ml-auto h-4 w-16" /></td>
                  </tr>
                ))
              ) : (
                // render top-level categories and their children
                sortByPosition(childrenMap['root'] || []).map((cat) => renderNode(cat, 0))
              )}
              {!loading && categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-500 dark:text-neutral-400">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


