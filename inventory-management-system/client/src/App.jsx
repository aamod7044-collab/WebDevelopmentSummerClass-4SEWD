import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import ProductList from "./pages/ProductList";
import ProductView from "./pages/ProductView";
import ProductForm from "./pages/ProductForm";
import SupplierList from "./pages/SupplierList";
import SupplierForm from "./pages/SupplierForm";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Everything below requires a valid login (see PrivateRoute) */}
      <Route path="/products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
      <Route path="/products/new" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
      <Route path="/products/:id" element={<PrivateRoute><ProductView /></PrivateRoute>} />
      <Route path="/products/:id/edit" element={<PrivateRoute><ProductForm /></PrivateRoute>} />

      <Route path="/suppliers" element={<PrivateRoute><SupplierList /></PrivateRoute>} />
      <Route path="/suppliers/new" element={<PrivateRoute><SupplierForm /></PrivateRoute>} />
      <Route path="/suppliers/:id/edit" element={<PrivateRoute><SupplierForm /></PrivateRoute>} />

      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}
