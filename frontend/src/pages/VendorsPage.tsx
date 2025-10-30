import { useEffect, useMemo, useState } from "react";
import {
  apiListVendors,
  apiCreateVendor,
  apiUpdateVendor,
} from "../api/client";
import type { Vendor } from "../api/client";
import { VendorTable } from "../components/VendorTable";
import { VendorForm } from "../components/VendorForm";
import { Modal } from "../components/Modal";
import { Toast } from "../components/Toast";

type SortDir = "asc" | "desc";

export function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [ratingSort, setRatingSort] = useState<SortDir>("desc");

  // toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastKind, setToastKind] = useState<"success" | "error" | "info">("info");
  const [toastTitle, setToastTitle] = useState<string>("");

  function showToast(kind: "success" | "error" | "info", title: string) {
    setToastKind(kind);
    setToastTitle(title);
    setToastOpen(true);
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setVendors(await apiListVendors());
    } catch (err: any) {
      const msg = err?.message || "Failed to load vendors";
      setError(msg);
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(data: any) {
    try {
      await apiCreateVendor(data);
      showFormClose();
      await load();
      showToast("success", "Vendor created");
    } catch (err: any) {
      showToast("error", err?.message || "Failed to create vendor");
      throw err; // форма сама покажет текст
    }
  }

  async function handleUpdate(data: any) {
    if (!editing) return;
    try {
      await apiUpdateVendor(editing.id, data);
      showFormClose();
      await load();
      showToast("success", "Vendor updated");
    } catch (err: any) {
      showToast("error", err?.message || "Failed to update vendor");
      throw err;
    }
  }

  function showFormClose() {
    setShowForm(false);
    setEditing(null);
  }

  const visibleVendors = useMemo(() => {
    const list = vendors ?? [];
    const filtered = categoryFilter.trim()
      ? list.filter((v) =>
          v.category.toLowerCase().includes(categoryFilter.trim().toLowerCase())
        )
      : list;
    return [...filtered].sort((a, b) =>
      ratingSort === "asc" ? a.rating - b.rating : b.rating - a.rating
    );
  }, [vendors, categoryFilter, ratingSort]);

  const isModalOpen = showForm || !!editing;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">📦</span>
        <h1 className="text-2xl font-semibold">Vendors</h1>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          placeholder="Filter by category..."
          className="px-3 py-2 border rounded-md text-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />

        <button
          onClick={() => setRatingSort((s) => (s === "asc" ? "desc" : "asc"))}
          className="px-3 py-2 text-sm border rounded-md"
        >
          Sort by rating: {ratingSort.toUpperCase()}
        </button>

        {!isModalOpen && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-400 rounded-md hover:bg-indigo-50 transition"
          >
            <span>➕</span> Add Vendor
          </button>
        )}
      </div>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {vendors && (
        <VendorTable vendors={visibleVendors} onEdit={(v) => setEditing(v)} />
      )}

      {/* Modal with form */}
      <Modal open={isModalOpen} title={editing ? "Edit Vendor" : "Add Vendor"} onClose={showFormClose}>
        <VendorForm initial={editing} onSubmit={editing ? handleUpdate : handleCreate} onCancel={showFormClose} />
      </Modal>

      {/* Toast */}
      <Toast
        open={toastOpen}
        kind={toastKind}
        title={toastTitle}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
}
