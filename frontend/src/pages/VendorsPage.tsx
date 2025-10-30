import { useEffect, useMemo, useState } from "react";
import {
  apiListVendors,
  apiCreateVendor,
  apiUpdateVendor,
} from "../api/client";
import type { Vendor } from "../api/client";
import { VendorTable } from "../components/VendorTable";
import { VendorForm } from "../components/VendorForm";

type SortDir = "asc" | "desc";

export function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);

  // NEW: filter & sort controls
  const [categoryFilter, setCategoryFilter] = useState("");
  const [ratingSort, setRatingSort] = useState<SortDir>("desc");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setVendors(await apiListVendors());
    } catch (err: any) {
      setError(err.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(data: any) {
    await apiCreateVendor(data);
    setShowForm(false);
    await load();
  }

  async function handleUpdate(data: any) {
    if (!editing) return;
    await apiUpdateVendor(editing.id, data);
    setEditing(null);
    await load();
  }

  // Apply filter + sort (memoized)
  const visibleVendors = useMemo(() => {
    const list = vendors ?? [];
    const filtered = categoryFilter.trim()
      ? list.filter((v) =>
          v.category.toLowerCase().includes(categoryFilter.trim().toLowerCase())
        )
      : list;

    const sorted = [...filtered].sort((a, b) =>
      ratingSort === "asc" ? a.rating - b.rating : b.rating - a.rating
    );
    return sorted;
  }, [vendors, categoryFilter, ratingSort]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1 style={{ marginBottom: 16 }}>📦 Vendors</h1>

      {/* Controls */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          placeholder="Filter by category..."
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: 6,
            border: "1px solid #ccc",
            minWidth: 220,
          }}
        />
        <button
          onClick={() => setRatingSort((s) => (s === "asc" ? "desc" : "asc"))}
        >
          {`Sort by rating: ${ratingSort.toUpperCase()}`}
        </button>

        {!showForm && !editing && (
          <button onClick={() => setShowForm(true)}>➕ Add Vendor</button>
        )}
      </div>

      {(showForm || editing) && (
        <VendorForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {vendors && (
        <VendorTable vendors={visibleVendors} onEdit={(v) => setEditing(v)} />
      )}
    </div>
  );
}
