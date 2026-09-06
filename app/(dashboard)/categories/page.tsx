"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Edit2, Plus, Tag, Trash2 } from "lucide-react";
import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from "@/lib/firestore";
import type { Category, EntryType } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

type CategoryForm = {
    name: string;
    type: EntryType;
    icon: string;
    color: string;
};

const emptyForm: CategoryForm = {
    name: "",
    type: "expense",
    icon: "tag",
    color: "#295b55",
};

const categoryTypes = [
    { label: "Expense", value: "expense" },
    { label: "Income", value: "income" },
] as const;

function CategoryFormModal({
    category,
    isSaving,
    errorMessage,
    onClose,
    onSubmit,
}: {
    category: Category | null;
    isSaving: boolean;
    errorMessage: string;
    onClose: () => void;
    onSubmit: (form: CategoryForm) => Promise<void>;
}) {
    const [form, setForm] = useState<CategoryForm>(
        category
            ? {
                name: category.name,
                type: category.type,
                icon: category.icon,
                color: category.color,
            }
            : emptyForm,
    );

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        void onSubmit({ ...form, name: form.name.trim() });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>{category ? "Edit category" : "Add category"}</CardTitle>
                    <CardDescription>
                        Categories help organize your income and expenses.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="category-form" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            {errorMessage && (
                                <p className="rounded-lg bg-[#fae8e4] px-3 py-2 text-sm text-[#9f4038]">
                                    {errorMessage}
                                </p>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Category Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Food And Necessities"
                                    value={form.name}
                                    onChange={(event) =>
                                        setForm((current) => ({ ...current, name: event.target.value }))
                                    }
                                    required
                                    autoFocus
                                    maxLength={50}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category-type">Category Type</Label>
                                <Select
                                    value={form.type}
                                    onValueChange={(value) =>
                                        setForm((current) => ({ ...current, type: value as EntryType }))
                                    }
                                >
                                    <SelectTrigger id="category-type" className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Category Type</SelectLabel>
                                            {categoryTypes.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex-row gap-2">
                    <Button type="button" variant="outline" className="w-1/2" onClick={onClose} disabled={isSaving}>
                        Close
                    </Button>
                    <Button type="submit" form="category-form" className="w-1/2" disabled={isSaving}>
                        {isSaving ? "Saving..." : category ? "Save changes" : "Create category"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function loadCategories(): Promise<void> {
        try {
            setCategories(await getCategories());
            setErrorMessage("");
        } catch {
            setErrorMessage("Unable to load categories.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getCategories()
            .then((loadedCategories) => {
                setCategories(loadedCategories);
                setErrorMessage("");
            })
            .catch(() => setErrorMessage("Unable to load categories."))
            .finally(() => setIsLoading(false));
    }, []);

    function openCreateForm(): void {
        setEditingCategory(null);
        setErrorMessage("");
        setIsFormOpen(true);
    }

    function openEditForm(category: Category): void {
        setEditingCategory(category);
        setErrorMessage("");
        setIsFormOpen(true);
    }

    async function handleSave(form: CategoryForm): Promise<void> {
        if (!form.name) {
            setErrorMessage("Category name is required.");
            return;
        }

        setIsSaving(true);
        setErrorMessage("");

        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, form);
            } else {
                await createCategory(form);
            }

            setIsFormOpen(false);
            setEditingCategory(null);
            await loadCategories();
        } catch (reason: unknown) {
            console.error("Could not save category:", reason);
            setErrorMessage(
                editingCategory ? "Could not update category." : "Could not create category.",
            );
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete(category: Category): Promise<void> {
        if (!window.confirm(`Delete ${category.name}?`)) {
            return;
        }

        setErrorMessage("");
        try {
            await deleteCategory(category.id);
            await loadCategories();
        } catch (reason: unknown) {
            setErrorMessage(
                reason instanceof Error
                    ? reason.message
                    : "Could not delete category.",
            );
        }
    }

    return (
        <div>
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <p className="mt-1 text-sm text-[var(--subtle)]">
                        Keep your income and expenses organized.
                    </p>
                </div>
                <Button
                    onClick={openCreateForm}
                    className="h-10 bg-[#295b55] px-4 text-white hover:bg-[#234d48]"
                >
                    <Plus size={17} />
                    Add category
                </Button>
            </div>

            {errorMessage && (
                <p className="mb-4 rounded-xl bg-[#fae8e4] px-4 py-3 text-sm text-[#9f4038]">
                    {errorMessage}
                </p>
            )}

            {isLoading ? (
                <div className="surface h-48 animate-pulse" />
            ) : categories.length > 0 ? (
                <div className="surface overflow-hidden">
                    <div className="divide-y divide-[var(--line)]">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center gap-3 px-5 py-4"
                            >
                                <div
                                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                                >
                                    <Tag size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-semibold">{category.name}</p>
                                    <p className="text-xs capitalize text-[var(--subtle)]">{category.type}</p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => openEditForm(category)}
                                    variant="ghost"
                                    size="icon"
                                    className="text-[var(--subtle)] hover:text-[var(--ink)]"
                                    aria-label={`Edit ${category.name}`}
                                    title="Edit category"
                                >
                                    <Edit2 size={16} />
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => void handleDelete(category)}
                                    variant="ghost"
                                    size="icon"
                                    className="text-[var(--subtle)] hover:bg-[#fae8e4] hover:text-[#9f4038]"
                                    aria-label={`Delete ${category.name}`}
                                    title="Delete category"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="surface flex min-h-48 flex-col items-center justify-center p-8 text-center">
                    <Tag size={24} className="text-[var(--subtle)]" />
                    <p className="mt-3 font-semibold">No categories yet</p>
                    <p className="mt-1 text-sm text-[var(--subtle)]">
                        Add a category to start organizing your transactions.
                    </p>
                </div>
            )}

            {isFormOpen && (
                <CategoryFormModal
                    category={editingCategory}
                    isSaving={isSaving}
                    errorMessage={errorMessage}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleSave}
                />
            )}
        </div>
    );
}