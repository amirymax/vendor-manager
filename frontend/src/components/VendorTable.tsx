import type { Vendor } from "../api/client";

type Props = {
  vendors: Vendor[];
  onEdit?: (v: Vendor) => void;
};

export function VendorTable({ vendors, onEdit }: Props) {
  if (vendors.length === 0) {
    return <p className="text-gray-500 text-sm">The list is empty. Add the first vendor.</p>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700 font-medium border-b">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Rating</th>
            <th className="px-4 py-2 text-right"></th>
          </tr>
        </thead>

        <tbody>
          {vendors.map((v, i) => (
            <tr
              key={v.id}
              className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-4 py-2 border-b">{v.id}</td>
              <td className="px-4 py-2 border-b">{v.name}</td>
              <td className="px-4 py-2 border-b">{v.contact_email}</td>
              <td className="px-4 py-2 border-b">{v.category}</td>
              <td className="px-4 py-2 border-b">{v.rating}</td>
              <td className="px-4 py-2 border-b text-right">
                <button
                  onClick={() => onEdit?.(v)}
                  className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 transition"
                >
                  ✏️ <span className="text-sm">Edit</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
