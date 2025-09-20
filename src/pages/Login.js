import { useState } from "react";
import API, { setAuthToken } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login({ setAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, role, username } = res.data;

      setAuth({ token, role, username });
      setAuthToken(token); // axios default header

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition">Login</button>
      </form>
    </div>
  );
}
