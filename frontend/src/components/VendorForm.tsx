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
    <form
      onSubmit={handleSubmit}
      style={{
        padding: 16,
        marginBottom: 24,
        border: "1px solid #ddd",
        borderRadius: 6,
        maxWidth: 450,
      }}
    >
      <h2 style={{ marginBottom: 12 }}>
        {initial ? "Edit Vendor" : "Add Vendor"}
      </h2>

      {error && (
        <p style={{ color: "red", marginBottom: 12, fontSize: 14 }}>{error}</p>
      )}

      <label style={label}>
        Name
        <input style={input} value={name} onChange={(e) => setName(e.target.value)} required />
      </label>

      <label style={label}>
        Email
        <input
          style={input}
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          required
        />
      </label>

      <label style={label}>
        Category
        <input style={input} value={category} onChange={(e) => setCategory(e.target.value)} required />
      </label>

      <label style={label}>
        Rating (1–5)
        <input
          style={input}
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
        />
      </label>

      <div style={{ marginTop: 12 }}>
        <button type="submit" disabled={submitting} style={{ marginRight: 8 }}>
          {submitting ? "Saving..." : "Save"}
        </button>

        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

const label: React.CSSProperties = {
  display: "block",
  marginBottom: 10,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  borderRadius: 4,
  border: "1px solid #ccc",
  marginTop: 4,
};
