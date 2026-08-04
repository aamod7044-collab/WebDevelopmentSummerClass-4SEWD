import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Boxes, Truck, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { initials } from "../utils/tagColor";

// Wraps every protected page. Top nav instead of a side rail — with only
// two sections (Products, Suppliers) a sidebar felt like empty real estate,
// so this is a slim bar with the nav pills in the middle, the same way most
// of the small internal tools I've used elsewhere are laid out.
export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const navLinks = (
    <>
      <NavLink to="/products" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMenuOpen(false)}>
        <Boxes size={16} /> Products
      </NavLink>
      <NavLink to="/suppliers" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMenuOpen(false)}>
        <Truck size={16} /> Suppliers
      </NavLink>
    </>
  );

  return (
    <div className="app-shell">
      <header className="topnav">
        <div className="topnav-brand">
          <span className="brand-mark">S</span>
          Stockroom
        </div>

        <nav className={menuOpen ? "open" : ""}>{navLinks}</nav>

        <div className="topnav-right">
          <button className="icon-btn mobile-menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="user-chip">
            <span className="user-avatar">{initials(user?.username)}</span>
            <span>{user?.username}</span>
            <button onClick={handleLogout} title="Log out" aria-label="Log out">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">{children}</main>
    </div>
  );
}
