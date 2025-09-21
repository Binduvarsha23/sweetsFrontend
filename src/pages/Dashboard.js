import { useEffect, useState } from "react";
import API from "../api/api";
import AdminPanel from "./AdminPanel";

export default function Dashboard({ auth }) {
  const [sweets, setSweets] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  // Fetch sweets initially
  const fetchSweets = async () => {
    try {
      const res = await API.get("/sweets");
      setSweets(res.data);
    } catch (err) {
      console.error("Error fetching sweets:", err.response?.data?.message || err.message);
    }
  };

  useEffect(() => { fetchSweets(); }, []);

  // Purchase (update local state without full fetch)
  const handlePurchase = async (sweetId) => {
    if (!auth.token) return alert("Please log in to purchase.");
    try {
      const res = await API.post(`/sweets/${sweetId}/purchase`, {}, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      setSweets(prev => prev.map(s => s._id === sweetId ? res.data : s));
      alert("Purchase successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Cannot purchase");
    }
  };

  // Search with debouncing
  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append("name", filters.name);
      if (filters.category) params.append("category", filters.category);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

      const endpoint = params.toString() ? `/sweets/search?${params}` : "/sweets";
      const res = await API.get(endpoint);
      setSweets(res.data);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Available Sweets</h1>

      {/* Search Bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["name", "category", "minPrice", "maxPrice"].map(f => (
          <input
            key={f}
            name={f}
            type={f.includes("Price") ? "number" : "text"}
            placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
            className="border p-2 rounded"
            value={filters[f]}
            onChange={(e) => setFilters({ ...filters, [f]: e.target.value })}
          />
        ))}
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Admin panel */}
      {auth.role === "admin" && <AdminPanel sweets={sweets} setSweets={setSweets} />}

      {/* User sweets list */}
      {auth.role !== "admin" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {sweets.map(s => (
            <div key={s._id} className="bg-white p-4 rounded shadow flex flex-col items-center">
              {s.image ? (
                <img src={s.image} alt={s.name} className="h-40 w-full object-cover mb-3 rounded"/>
              ) : (
                <div className="h-40 w-full bg-gray-200 mb-3 flex items-center justify-center">No Image</div>
              )}
              <h2 className="text-xl font-semibold">{s.name}</h2>
              <p className="text-gray-600">Category: {s.category}</p>
              <p className="mt-1 text-gray-700 font-medium">Price: ${s.price}</p>
              <p className="text-gray-500">Stock: {s.quantity}</p>
              <button
                className={`mt-3 px-4 py-2 rounded ${s.quantity === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"}`}
                onClick={() => handlePurchase(s._id)}
                disabled={s.quantity === 0}
              >
                {auth.token ? "Purchase" : "Login to Purchase"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
