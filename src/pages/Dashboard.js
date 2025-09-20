import { useEffect, useState } from "react";
import API from "../api/api";
import AdminPanel from "./AdminPanel";

export default function Dashboard({ auth }) {
  const [sweets, setSweets] = useState([]);

  const fetchSweets = async () => {
    try {
      const res = await API.get("/sweets");
      setSweets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePurchase = async (sweetId) => {
    if (!auth.token) {
      alert("Please login to purchase.");
      return;
    }
    try {
      await API.post(`/sweets/${sweetId}/purchase`);
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Cannot purchase");
    }
  };

  useEffect(() => { fetchSweets(); }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Available Sweets</h1>

      {auth.role === "admin" && <AdminPanel fetchSweets={fetchSweets} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sweets.map(s => (
          <div key={s._id} className="bg-white p-4 rounded shadow flex flex-col items-center">
            {s.image && <img src={s.image} alt={s.name} className="h-32 w-32 object-cover mb-2 rounded" />}
            <h2 className="font-bold">{s.name}</h2>
            <p>{s.category}</p>
            <p>${s.price}</p>
            <p>Stock: {s.quantity}</p>
            <button
              className={`mt-2 px-4 py-1 rounded ${s.quantity === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"}`}
              onClick={() => handlePurchase(s._id)}
              disabled={s.quantity === 0}
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
