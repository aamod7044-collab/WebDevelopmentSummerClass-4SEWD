import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Mail, Phone, Truck } from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { tagColorFor, shortCode } from "../utils/tagColor";

export default function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSuppliers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/suppliers");
      setSuppliers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load suppliers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/suppliers/${id}`);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      // e.g. server blocks deletion while products still reference this supplier
      alert(err.response?.data?.message || "Failed to delete supplier.");
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <span className="eyebrow">Directory</span>
          <h1>Suppliers</h1>
        </div>
        <Link to="/suppliers/new" className="btn btn-primary">+ Add supplier</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p>Loading…</p>
      ) : suppliers.length === 0 ? (
        <div className="empty-state panel">
          <Truck size={30} />
          <p>No suppliers yet. Add your first one to link it to products.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="ledger">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Contact email</th>
                <th>Phone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => {
                const color = tagColorFor(s.name);
                return (
                  <tr key={s.id}>
                    <td>
                      <span
                        className="supplier-tag"
                        style={{ background: color.bg, color: color.text, marginRight: 10 }}
                      >
                        <span className="dot" /> {shortCode(s.name)}
                      </span>
                      {s.name}
                    </td>
                    <td>
                      {s.contactEmail ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-dim)" }}>
                          <Mail size={13} /> {s.contactEmail}
                        </span>
                      ) : <em>—</em>}
                    </td>
                    <td>
                      {s.phone ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-dim)" }}>
                          <Phone size={13} /> {s.phone}
                        </span>
                      ) : <em>—</em>}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <Link to={`/suppliers/${s.id}/edit`} className="icon-btn" aria-label="Edit" title="Edit">
                          <Pencil size={15} />
                        </Link>
                        <button className="icon-btn" aria-label="Delete" title="Delete" onClick={() => handleDelete(s.id, s.name)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
