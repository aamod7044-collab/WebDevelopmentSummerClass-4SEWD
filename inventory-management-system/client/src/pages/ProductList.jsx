import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  LayoutGrid,
  List as ListIcon,
  Pencil,
  Trash2,
  PackageX,
  ImageOff,
  RotateCcw,
} from "lucide-react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { tagColorFor, shortCode } from "../utils/tagColor";

const LOW_STOCK_THRESHOLD = 5;
// Just a rough benchmark for the little stock bar on each card — not a real
// "healthy stock" figure from the business, just enough range that the bar
// actually moves instead of always looking maxed out.
const GAUGE_REFERENCE = LOW_STOCK_THRESHOLD * 6;

function stockStatusOf(qty) {
  if (qty <= 0) return "out";
  if (qty < LOW_STOCK_THRESHOLD) return "low";
  return "in";
}

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [stockStatus, setStockStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (search) params.search = search;
      if (supplierId) params.supplierId = supplierId;
      const { data } = await api.get("/products", { params });
      setProducts(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [search, supplierId]);

  useEffect(() => {
    // Load supplier list once, for the filter dropdown
    api.get("/suppliers").then((res) => setSuppliers(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    // Debounce search typing slightly so we don't hit the API on every keystroke
    const t = setTimeout(loadProducts, 250);
    return () => clearTimeout(t);
  }, [loadProducts]);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product.");
    }
  }

  function resetFilters() {
    setStockStatus("all");
    setSortBy("name-asc");
    setMinPrice("");
    setMaxPrice("");
    setSupplierId("");
  }

  // Stock status / price range / sort all happen client-side against
  // whatever the server already returned for search + supplier — no need
  // to round-trip the API for filters this small.
  const visibleProducts = useMemo(() => {
    let list = [...products];

    if (stockStatus !== "all") {
      list = list.filter((p) => stockStatusOf(p.quantity) === stockStatus);
    }
    if (minPrice !== "") list = list.filter((p) => Number(p.price) >= Number(minPrice));
    if (maxPrice !== "") list = list.filter((p) => Number(p.price) <= Number(maxPrice));

    list.sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "qty-asc": return a.quantity - b.quantity;
        case "qty-desc": return b.quantity - a.quantity;
        default: return a.name.localeCompare(b.name);
      }
    });

    return list;
  }, [products, stockStatus, minPrice, maxPrice, sortBy]);

  return (
    <Layout>
      <div className="page-header">
        <div>
          <span className="eyebrow">Inventory</span>
          <h1>Products</h1>
        </div>
        <Link to="/products/new" className="btn btn-primary">+ Add product</Link>
      </div>

      <div className="browse-layout">
        <aside className="filter-rail">
          <h3>Filters</h3>

          <div className="filter-group">
            <label htmlFor="f-supplier">Supplier</label>
            <select id="f-supplier" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
              <option value="">All suppliers</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="f-status">Stock status</label>
            <select id="f-status" value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="in">In stock</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="f-sort">Sort by</label>
            <select id="f-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name-asc">Name (A–Z)</option>
              <option value="price-asc">Price (low–high)</option>
              <option value="price-desc">Price (high–low)</option>
              <option value="qty-asc">Quantity (low–high)</option>
              <option value="qty-desc">Quantity (high–low)</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price range (£)</label>
            <div className="filter-range">
              <input type="number" min="0" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              <input type="number" min="0" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
          </div>

          <button className="btn filter-reset" onClick={resetFilters}>
            <RotateCcw size={13} /> Reset filters
          </button>
        </aside>

        <div>
          <div className="toolbar">
            <div className="search-input-wrap">
              <Search />
              <input
                type="text"
                placeholder="Search by name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="toolbar-spacer" />
            <div className="view-toggle">
              <button
                className={viewMode === "list" ? "active" : ""}
                onClick={() => setViewMode("list")}
                aria-label="List view"
                title="List view"
              >
                <ListIcon size={16} />
              </button>
              <button
                className={viewMode === "grid" ? "active" : ""}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                title="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <p>Loading…</p>
          ) : visibleProducts.length === 0 ? (
            <div className="empty-state panel">
              <PackageX size={30} />
              <p>{products.length === 0 ? "No products match your search yet." : "No products match these filters."}</p>
            </div>
          ) : (
            <>
              <p className="result-count">
                {visibleProducts.length} of {products.length} product{products.length === 1 ? "" : "s"}
              </p>

              {viewMode === "list" ? (
                <div className="card-list">
                  {visibleProducts.map((p) => (
                    <ProductRowCard key={p.id} product={p} onDelete={handleDelete} />
                  ))}
                </div>
              ) : (
                <div className="card-grid">
                  {visibleProducts.map((p) => (
                    <ProductGridCard key={p.id} product={p} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

function ProductRowCard({ product: p, onDelete }) {
  const status = stockStatusOf(p.quantity);
  const gaugePct = Math.max(4, Math.min(100, Math.round((p.quantity / GAUGE_REFERENCE) * 100)));
  const statusLabel = status === "in" ? "In stock" : status === "low" ? "Low stock" : "Out of stock";

  return (
    <div className={`product-row-card ${status === "low" || status === "out" ? "is-low" : ""}`}>
      <div className="card-top">
        {p.imagePath ? (
          <img className="card-thumb" src={p.imagePath} alt={p.name} />
        ) : (
          <div className="card-thumb-placeholder"><ImageOff size={16} /></div>
        )}

        <div className="card-name-block">
          <span className="name"><Link to={`/products/${p.id}`}>{p.name}</Link></span>
          <span className="card-stock-line">
            {p.quantity} in stock
            {status !== "in" && <span className="stock-flag-low"> · {status === "out" ? "out" : "low"}</span>}
          </span>
        </div>

        {p.supplier ? (
          <span className="supplier-tag" style={{ background: tagColorFor(p.supplier.name).bg, color: tagColorFor(p.supplier.name).text }}>
            <span className="dot" /> {shortCode(p.supplier.name)}
          </span>
        ) : (
          <span className="supplier-tag unassigned">Unassigned</span>
        )}

        <div className="card-meta-col">
          <span className="cap">Price</span>
          <span className="val">£{Number(p.price).toFixed(2)}</span>
        </div>
        <div className="card-meta-col">
          <span className="cap">Qty</span>
          <span className="val">{p.quantity}</span>
        </div>

        <div className="card-actions">
          <Link to={`/products/${p.id}/edit`} className="icon-btn" aria-label="Edit" title="Edit"><Pencil size={15} /></Link>
          <button className="icon-btn" aria-label="Delete" title="Delete" onClick={() => onDelete(p.id, p.name)}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="card-bottom">
        <div className="stock-gauge">
          <div className="track">
            <div className={`fill ${status === "in" ? "ok" : "low"}`} style={{ width: `${gaugePct}%` }} />
          </div>
          <span className="caption">reorder below {LOW_STOCK_THRESHOLD}</span>
        </div>
        <span className={`status-pill ${status === "in" ? "in-stock" : status === "low" ? "low-stock" : "out-of-stock"}`}>
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

function ProductGridCard({ product: p, onDelete }) {
  const status = stockStatusOf(p.quantity);
  return (
    <div className="grid-card">
      {p.imagePath ? (
        <img className="grid-thumb" src={p.imagePath} alt={p.name} />
      ) : (
        <div className="grid-thumb-placeholder"><ImageOff size={18} /></div>
      )}
      <span className="name"><Link to={`/products/${p.id}`}>{p.name}</Link></span>
      <div className="row-between">
        <span className="price">£{Number(p.price).toFixed(2)}</span>
        <span className={`status-pill ${status === "in" ? "in-stock" : status === "low" ? "low-stock" : "out-of-stock"}`}>
          {p.quantity}
        </span>
      </div>
      <div className="grid-actions">
        <Link to={`/products/${p.id}/edit`} className="btn btn-sm">Edit</Link>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(p.id, p.name)}>Delete</button>
      </div>
    </div>
  );
}
