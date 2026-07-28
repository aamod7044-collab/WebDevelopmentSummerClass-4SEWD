import { NavLink } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    user && (
      <>
        <span>Welcome, {user.fullName}</span>
        <button onClick={handleLogout}>Log Out</button>
        <nav>
          <NavLink
            className={({ isActive }) => (isActive ? "active-link" : "")}
            to={"/"}
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? "active-link" : "")}
            to={"/todo/add"}
          >
            Add To-Do Item
          </NavLink>
        </nav>
      </>
    )
  );
}

export default NavBar;
