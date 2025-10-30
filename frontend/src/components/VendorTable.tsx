import type { Vendor } from "../api/client";

type Props = {
  vendors: Vendor[];
  onEdit?: (v: Vendor) => void;
};

export function VendorTable({ vendors, onEdit }: Props) {
  if (vendors.length === 0) {
    return <p>The list is empty. Add the first vendor.</p>;
  }

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        border: "1px solid #ddd",
      }}
    >
      <thead>
        <tr style={{ background: "#fafafa" }}>
          <th style={th}>ID</th>
          <th style={th}>Name</th>
          <th style={th}>Email</th>
          <th style={th}>Category</th>
          <th style={th}>Rating</th>
          <th style={th}></th>
        </tr>
      </thead>
      <tbody>
        {vendors.map((v) => (
          <tr key={v.id}>
            <td style={td}>{v.id}</td>
            <td style={td}>{v.name}</td>
            <td style={td}>{v.contact_email}</td>
            <td style={td}>{v.category}</td>
            <td style={td}>{v.rating}</td>
            <td style={td}>
              <button onClick={() => onEdit?.(v)}>✏️ Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "1px solid #ddd",
};

const td: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #ddd",
};
