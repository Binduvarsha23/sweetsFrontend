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

  // Fetch sweets (all or search)
  const fetchSweets = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append("name", filters.name);
      if (filters.category) params.append("category", filters.category);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

      const endpoint = params.toString()
        ? `/sweets/search?${params}`
        : "/sweets";

      const res = await API.get(endpoint);
      setSweets(res.data);
    } catch (err) {
      console.error(
        "Error fetching sweets:",
        err.response?.data?.message || err.message
      );
    }
  };

  // Purchase (user)
  const handlePurchase = async (sweetId) => {
    if (!auth.token) {
      alert("Please log in to purchase.");
      return;
    }
    try {
      await API.post(
        `/sweets/${sweetId}/purchase`,
        {},
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      fetchSweets();
      alert("Purchase successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Cannot purchase");
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Available Sweets</h1>

      {/* 🔍 Search Bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        <input
          name="name"
          placeholder="Search by name"
          className="border p-2 rounded"
          value={filters.name}
          onChange={(e) =>
            setFilters({ ...filters, [e.target.name]: e.target.value })
          }
        />
        <input
          name="category"
          placeholder="Category"
          className="border p-2 rounded"
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, [e.target.name]: e.target.value })
          }
        />
        <input
          name="minPrice"
          type="number"
          placeholder="Min Price"
          className="border p-2 rounded"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters({ ...filters, [e.target.name]: e.target.value })
          }
        />
        <input
          name="maxPrice"
          type="number"
          placeholder="Max Price"
          className="border p-2 rounded"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, [e.target.name]: e.target.value })
          }
        />
        <button
          onClick={fetchSweets}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Admin panel */}
      {auth.role === "admin" && (
        <AdminPanel fetchSweets={fetchSweets} sweets={sweets} />
      )}

      {/* Public sweets list */}
      {auth.role !== "admin" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {sweets.map((s) => (
            <div
              key={s._id}
              className="bg-white p-4 rounded shadow flex flex-col items-center"
            >
              {s.image ? (
                <img
                  src={s.image}
                  alt={s.name}
                  className="h-40 w-full object-cover mb-3 rounded"
                />
              ) : (
                <div className="h-40 w-full bg-gray-200 mb-3 flex items-center justify-center">
                  No Image
                </div>
              )}

              <h2 className="text-xl font-semibold">Sweet Name: {s.name}</h2>
              <p className="text-gray-600">Category: {s.category}</p>
              <p className="mt-1 text-gray-700 font-medium">Price: ${s.price}</p>
              <p className="text-gray-500">Stock: {s.quantity}</p>

              <button
                className={`mt-3 px-4 py-2 rounded ${
                  s.quantity === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
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
