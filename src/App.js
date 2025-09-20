import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  const [auth, setAuth] = useState({ token: null, role: null, username: null });

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-700">Sweet Shop</h1>
          <nav className="space-x-4">
            <Link className="text-purple-600 hover:underline" to="/login">Login</Link>
            <Link className="text-purple-600 hover:underline" to="/register">Register</Link>
            <Link className="text-purple-600 hover:underline" to="/dashboard">Dashboard</Link>
          </nav>
        </header>

        <main className="p-6">
          <Routes>
            <Route path="/login" element={<Login setAuth={setAuth} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard auth={auth} />} />
            <Route path="/admin" element={auth.role === "admin" ? <AdminPanel /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
