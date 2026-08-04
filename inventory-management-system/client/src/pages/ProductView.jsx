import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ImageOff, AlertTriangle } from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { tagColorFor, shortCode } from "../utils/tagColor";

const LOW_STOCK_THRESHOLD = 5;

export default function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load product."));
  }, [id]);

  if (error) {
    return (
      <Layout>
        <div className="alert alert-error">{error}</div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <p>Loading…</p>
      </Layout>
    );
  }

  const isLow = product.quantity < LOW_STOCK_THRESHOLD;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <span className="eyebrow">Product</span>
          <h1>{product.name}</h1>
        </div>
        <Link to={`/products/${product.id}/edit`} className="btn btn-primary">Edit product</Link>
      </div>

      <div className="panel detail-grid">
        {product.imagePath ? (
          <img src={product.imagePath} alt={product.name} />
        ) : (
          <div className="no-image"><ImageOff size={22} style={{ marginBottom: 6 }} /><br />No image uploaded</div>
        )}

        <div>
          {isLow && (
            <div className="alert alert-error" style={{ display: "inline-flex" }}>
              <AlertTriangle size={15} /> Low stock — only {product.quantity} left
            </div>
          )}

          <div className="detail-row">
            <span className="label">Description</span>
            {product.description || <em>No description provided.</em>}
          </div>
          <div className="detail-row">
            <span className="label">Price</span>
            £{Number(product.price).toFixed(2)}
          </div>
          <div className="detail-row">
            <span className="label">Quantity in stock</span>
            <span className="qty-figure">{product.quantity}</span>
          </div>
          <div className="detail-row">
            <span className="label">Supplier</span>
            {product.supplier ? (
              <Link to={`/suppliers`}>
                <span
                  className="supplier-tag"
                  style={{ background: tagColorFor(product.supplier.name).bg, color: tagColorFor(product.supplier.name).text }}
                >
                  <span className="dot" /> {shortCode(product.supplier.name)}
                </span>
                {" "}{product.supplier.name}
              </Link>
            ) : (
              <em>Unassigned</em>
            )}
          </div>
        </div>
      </div>

      <p style={{ marginTop: 20 }}>
        <Link to="/products" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <ArrowLeft size={14} /> Back to products
        </Link>
      </p>
    </Layout>
  );
}
