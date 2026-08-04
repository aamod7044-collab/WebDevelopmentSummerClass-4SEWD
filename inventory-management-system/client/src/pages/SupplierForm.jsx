import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";

const initialForm = { name: "", contactEmail: "", phone: "" };

// Same shape as ProductForm.jsx: client-side validation for quick feedback,
// server-side validation as the real source of truth.
export default function SupplierForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/suppliers/${id}`).then((res) => {
      const s = res.data;
      setForm({ name: s.name, contactEmail: s.contactEmail, phone: s.phone || "" });
      setLoading(false);
    }).catch((err) => {
      setServerError(err.response?.data?.message || "Failed to load supplier.");
      setLoading(false);
    });
  }, [id, isEdit]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const errors = {};
    if (!form.name.trim()) errors.name = "Supplier name is required.";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.contactEmail.trim()) {
      errors.contactEmail = "Contact email is required.";
    } else if (!emailPattern.test(form.contactEmail.trim())) {
      errors.contactEmail = "Please enter a valid email address.";
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
      const payload = {
        name: form.name.trim(),
        contactEmail: form.contactEmail.trim(),
        phone: form.phone.trim(),
      };
      if (isEdit) {
        await api.put(`/suppliers/${id}`, payload);
      } else {
        await api.post("/suppliers", payload);
      }
      navigate("/suppliers");
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to save supplier.");
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
          <h1>{isEdit ? "Edit supplier" : "Add supplier"}</h1>
        </div>
      </div>

      {serverError && <div className="alert alert-error"><AlertCircle size={15} /> {serverError}</div>}

      <form className="panel form-grid" onSubmit={handleSubmit} noValidate>
        <div className={`field full ${fieldErrors.name ? "has-error" : ""}`}>
          <label htmlFor="name">Supplier name *</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </div>

        <div className={`field full ${fieldErrors.contactEmail ? "has-error" : ""}`}>
          <label htmlFor="contactEmail">Contact email *</label>
          <input
            id="contactEmail"
            type="email"
            value={form.contactEmail}
            onChange={(e) => handleChange("contactEmail", e.target.value)}
          />
          {fieldErrors.contactEmail && <span className="field-error">{fieldErrors.contactEmail}</span>}
        </div>

        <div className="field full">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : isEdit ? "Save changes" : "Add supplier"}
          </button>
          <Link to="/suppliers" className="btn">Cancel</Link>
        </div>
      </form>
    </Layout>
  );
}
