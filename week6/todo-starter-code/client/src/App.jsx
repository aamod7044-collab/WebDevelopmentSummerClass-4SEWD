import PageTitle from "./components/PageTitle/PageTitle";
import NavBar from "./components/NavBar/NavBar";
import Home from "./pages/Home";
import AddTodo from "./pages/AddTodo";
import TodoDetail from "./pages/TodoDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <PageTitle />
      <BrowserRouter>
        <AuthProvider>
          <NavBar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/todo/add"
              element={
                <ProtectedRoute>
                  <AddTodo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/todo/:id"
              element={
                <ProtectedRoute>
                  <TodoDetail />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
