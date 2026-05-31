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
import { Pencil, Plus, Trash2, X } from "lucide-react";
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
}

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  emoji: "",
  parent: "none",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [form, setForm] = useState(emptyForm);

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

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setSlugManuallyEdited(false);
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
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        image: form.image.trim(),
        emoji: form.emoji.trim(),
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Categories</h1>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
        <h3 className="mb-3 font-semibold dark:text-white">{editingId ? "Edit Category" : "Add Category"}</h3>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
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
          <div>
            <Label>Thumbnail</Label>
            <div className="space-y-2">
              {form.image ? (
                <div className="relative h-12 w-12 overflow-hidden rounded border border-neutral-200 dark:border-neutral-700">
                  <Image src={form.image} alt="Category thumbnail" fill className="object-cover" unoptimized />
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, image: "" }))}
                    className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="h-12 w-12 rounded border border-dashed border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800" />
              )}
              <Input type="file" accept="image/*" disabled={uploadingImage} onChange={handleImageUpload} />
              {uploadingImage ? <p className="text-xs text-neutral-500">Uploading...</p> : null}
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-2">          <Button onClick={handleSubmit}>
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
                categories.map((cat) => (
                  <tr key={cat._id} className={`border-b border-neutral-100 dark:border-neutral-800 ${cat.deletedAt ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="relative h-8 w-8 flex-none overflow-hidden rounded border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
                          {cat.image ? (
                            <Image src={cat.image} alt={cat.name} fill className="object-cover" unoptimized />
                          ) : cat.emoji ? (
                            <div className="flex h-full w-full items-center justify-center text-sm">{cat.emoji}</div>
                          ) : null}
                        </div>
                        <div>
                          {cat.name}
                          {cat.deletedAt && (
                            <span className="ml-2 inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                              Deleted
                            </span>
                          )}
                        </div>
                      </div>
                    </td>                    <td className="px-4 py-3 text-neutral-500">{cat.slug}</td>
                    <td className="px-4 py-3">{cat.parent?.name || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cat)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!loading && categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-neutral-500 dark:text-neutral-400">
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







