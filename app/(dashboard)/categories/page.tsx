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

function CategoryFormModal({
    category,
    isSaving,
    onClose,
    onSubmit,
}: {
    category: Category | null;
    isSaving: boolean;
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
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-3xl bg-[var(--surface)] p-6 shadow-xl"
            >
                <h2 className="text-xl font-bold">
                    {category ? "Edit category" : "Add category"}
                </h2>
                <p className="mt-1 text-sm text-[var(--subtle)]">
                    Categories help organize your income and expenses.
                </p>

                <div className="mt-5 grid gap-4">
                    <label>
                        <span className="field-label">Name</span>
                        <input
                            name="name"
                            value={form.name}
                            onChange={(event) =>
                                setForm((current) => ({ ...current, name: event.target.value }))
                            }
                            required
                            autoFocus
                            className="field-input"
                            maxLength={50}
                        />
                    </label>
                    <label>
                        <span className="field-label">Type</span>
                        <select
                            name="type"
                            value={form.type}
                            onChange={(event) =>
                                setForm((current) => ({
                                    ...current,
                                    type: event.target.value as EntryType,
                                }))
                            }
                            className="field-input"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </label>
                    <label>
                        <span className="field-label">Color</span>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={form.color}
                                onChange={(event) =>
                                    setForm((current) => ({ ...current, color: event.target.value }))
                                }
                                className="h-10 w-12 cursor-pointer rounded-lg border border-[var(--line)] bg-transparent p-1"
                                aria-label="Category color"
                            />
                            <input
                                value={form.color}
                                onChange={(event) =>
                                    setForm((current) => ({ ...current, color: event.target.value }))
                                }
                                pattern="^#[0-9A-Fa-f]{6}$"
                                required
                                className="field-input flex-1"
                                aria-label="Category hex color"
                            />
                        </div>
                    </label>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="h-10 flex-1 rounded-xl border border-[var(--line)] text-sm font-semibold disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="h-10 flex-1 rounded-xl bg-[#295b55] text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : category ? "Save changes" : "Create category"}
                    </button>
                </div>
            </form>
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
        } catch {
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
                <button
                    onClick={openCreateForm}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#295b55] px-4 text-sm font-semibold text-white"
                >
                    <Plus size={17} />
                    Add category
                </button>
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
                                <button
                                    type="button"
                                    onClick={() => openEditForm(category)}
                                    className="grid h-9 w-9 place-items-center rounded-lg text-[var(--subtle)] hover:bg-[var(--muted)] hover:text-[var(--ink)]"
                                    aria-label={`Edit ${category.name}`}
                                    title="Edit category"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => void handleDelete(category)}
                                    className="grid h-9 w-9 place-items-center rounded-lg text-[var(--subtle)] hover:bg-[#fae8e4] hover:text-[#9f4038]"
                                    aria-label={`Delete ${category.name}`}
                                    title="Delete category"
                                >
                                    <Trash2 size={16} />
                                </button>
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
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleSave}
                />
            )}
        </div>
    );
}