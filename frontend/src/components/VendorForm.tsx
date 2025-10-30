import { useState, useEffect } from "react";
import type { Vendor, VendorCreate, VendorUpdate } from "../api/client";

type Props = {
  initial?: Vendor | null; // when provided → edit mode
  onSubmit: (data: VendorCreate | VendorUpdate) => Promise<void>;
  onCancel?: () => void;
};

export function VendorForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [contactEmail, setContactEmail] = useState(initial?.contact_email ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [rating, setRating] = useState(initial?.rating ?? 1);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(initial?.name ?? "");
    setContactEmail(initial?.contact_email ?? "");
    setCategory(initial?.category ?? "");
    setRating(initial?.rating ?? 1);
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        name,
        contact_email: contactEmail,
        category,
        rating,
      });
    } catch (err: any) {
      setError(err.message || "Failed to save vendor");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Card */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-4">
            {initial ? "Edit Vendor" : "Add Vendor"}
          </h2>

          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </span>
              <input
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:border-indigo-400 focus:ring"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-invalid={!name ? true : undefined}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </span>
              <input
                type="email"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:border-indigo-400 focus:ring"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                aria-invalid={!contactEmail ? true : undefined}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </span>
              <input
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:border-indigo-400 focus:ring"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                aria-invalid={!category ? true : undefined}
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between">
                <span className="mb-1 block text-sm font-medium text-gray-700">
                  Rating (1–5) <span className="text-red-500">*</span>
                </span>
                <span className="text-xs text-gray-500">Integer only</span>
              </div>
              <input
                type="number"
                min={1}
                max={5}
                className="w-28 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:border-indigo-400 focus:ring"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t bg-gray-50 p-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
}
