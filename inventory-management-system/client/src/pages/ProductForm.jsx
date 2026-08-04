import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";

const initialForm = { name: "", description: "", price: "", quantity: "", supplierId: "" };

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [suppliers, setSuppliers] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [existingImagePath, setExistingImagePath] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/suppliers").then((res) => setSuppliers(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/products/${id}`).then((res) => {
      const p = res.data;
      setForm({
        name: p.name,
        description: p.description || "",
        price: String(p.price),
        quantity: String(p.quantity),
        supplierId: p.supplierId || "",
      });
      setExistingImagePath(p.imagePath);
      setLoading(false);
    }).catch((err) => {
      setServerError(err.response?.data?.message || "Failed to load product.");
      setLoading(false);
    });
  }, [id, isEdit]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // --- Client-side validation: immediate, friendly feedback ---
  // The server repeats every one of these checks - this is just for UX speed.
  function validate() {
    const errors = {};
    if (!form.name.trim()) errors.name = "Product name is required.";

    if (form.price === "" || form.price === null) {
      errors.price = "Price is required.";
    } else if (isNaN(form.price) || Number(form.price) < 0) {
      errors.price = "Price must be a number that is not negative.";
    }

    if (form.quantity === "" || form.quantity === null) {
      errors.quantity = "Quantity is required.";
    } else if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 0) {
      errors.quantity = "Quantity must be a whole number that is not negative.";
    }

    if (imageFile) {
      const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowed.includes(imageFile.type)) {
        errors.image = "Please choose an image file (jpg, png, gif, or webp).";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("description", form.description.trim());
      payload.append("price", form.price);
      payload.append("quantity", form.quantity);
      if (form.supplierId) payload.append("supplierId", form.supplierId);
      if (imageFile) payload.append("image", imageFile);

      if (isEdit) {
        await api.put(`/products/${id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/products", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      navigate("/products");
    } catch (err) {
      // Server-side validation is the source of truth - surface its message
      // even if our client check somehow missed something.
      setServerError(err.response?.data?.message || "Failed to save product.");
      if (err.response?.data?.errors) {
        console.warn("Server validation errors:", err.response.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Layout><p>Loading…</p></Layout>;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <span className="eyebrow">{isEdit ? "Edit" : "New"}</span>
          <h1>{isEdit ? "Edit product" : "Add product"}</h1>
        </div>
      </div>

      {serverError && <div className="alert alert-error"><AlertCircle size={15} /> {serverError}</div>}

      <form className="panel form-grid" onSubmit={handleSubmit} noValidate>
        <div className={`field full ${fieldErrors.name ? "has-error" : ""}`}>
          <label htmlFor="name">Product name *</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </div>

        <div className="field full">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={3}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className={`field ${fieldErrors.price ? "has-error" : ""}`}>
          <label htmlFor="price">Price (£) *</label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
          {fieldErrors.price && <span className="field-error">{fieldErrors.price}</span>}
        </div>

        <div className={`field ${fieldErrors.quantity ? "has-error" : ""}`}>
          <label htmlFor="quantity">Quantity *</label>
          <input
            id="quantity"
            type="number"
            step="1"
            min="0"
            value={form.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
          />
          {fieldErrors.quantity && <span className="field-error">{fieldErrors.quantity}</span>}
        </div>

        <div className="field full">
          <label htmlFor="supplierId">Supplier</label>
          <select
            id="supplierId"
            value={form.supplierId}
            onChange={(e) => handleChange("supplierId", e.target.value)}
          >
            <option value="">— Unassigned —</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className={`field full ${fieldErrors.image ? "has-error" : ""}`}>
          <label htmlFor="image">Product image</label>
          {existingImagePath && !imageFile && (
            <div className="image-preview-current">
              <img src={existingImagePath} alt="Current" />
              <span style={{ fontSize: "0.85rem", color: "var(--text-faint)" }}>Current image (choose a file to replace it)</span>
            </div>
          )}
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
          {fieldErrors.image && <span className="field-error">{fieldErrors.image}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : isEdit ? "Save changes" : "Add product"}
          </button>
          <Link to="/products" className="btn">Cancel</Link>
        </div>
      </form>
    </Layout>
  );
}
