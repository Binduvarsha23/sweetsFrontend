import { useEffect, useState } from "react";
import API from "../api/api";
import AdminPanel from "./AdminPanel";
import SweetCard from "./SweetCard";

export default function Dashboard({ auth }) {
  const [sweets, setSweets] = useState([]);

  const fetchSweets = async () => {
    try {
      const res = await API.get("/sweets");
      setSweets(res.data);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const handlePurchase = async (sweetId) => {
    if (!auth.token) {
      alert("Please log in to purchase.");
      return;
    }
    try {
      await API.post(`/sweets/${sweetId}/purchase`, {}, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      fetchSweets();
      alert("Purchase successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Cannot purchase");
    }
  };

  useEffect(() => { fetchSweets(); }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Available Sweets</h1>

      {auth.role === "admin" && <AdminPanel fetchSweets={fetchSweets} sweets={sweets} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {sweets.map(s => (
          <SweetCard key={s._id} sweet={s} fetchSweets={fetchSweets} auth={auth} handlePurchase={handlePurchase} />
        ))}
      </div>
    </div>
  );
}
