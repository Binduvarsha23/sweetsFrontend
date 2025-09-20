import { useState } from "react";
import API from "../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function AdminPanel({ fetchSweets, sweets }) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    quantity: "",
    image: "",
  });
  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await API.put(`/sweets/${form.id}`, form);
      else await API.post("/sweets", form);
      fetchSweets();
      setForm({
        id: "",
        name: "",
        category: "",
        price: "",
        quantity: "",
        image: "",
      });
      setEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error saving sweet");
    }
  };

  const handleEdit = (sweet) => {
    setForm({ ...sweet, id: sweet._id });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/sweets/${id}`);
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting");
    }
  };

  const handleRestock = async (id) => {
    try {
      await API.post(`/sweets/${id}/restock`, { amount: 5 });
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Error restocking");
    }
  };

  const handleDecrease = async (id) => {
    try {
      await API.post(`/sweets/${id}/purchase`);
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Error decreasing stock");
    }
  };

  return (
    <div className="mb-6 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">
        {editing ? "Edit Sweet" : "Add New Sweet"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {["name", "category", "price", "quantity"].map((f) => (
          <div key={f}>
            <label className="block font-medium mb-1">
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </label>
            <input
              type={f === "price" || f === "quantity" ? "number" : "text"}
              name={f}
              value={form[f]}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
        ))}
        <div>
          <label className="block font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full"
          />
          {form.image && (
            <img
              src={form.image}
              alt="preview"
              className="h-24 w-24 object-cover mt-2 rounded"
            />
          )}
        </div>
        <button className="bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition">
          {editing ? "Update Sweet" : "Add Sweet"}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="font-bold mb-2">Existing Sweets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sweets.map((s) => (
            <div
              key={s._id}
              className="bg-gray-100 p-2 rounded shadow flex flex-col items-center"
            >
              {s.image ? (
                <img
                  src={s.image}
                  alt={s.name}
                  className="h-32 w-full object-cover mb-2 rounded"
                />
              ) : (
                <div className="h-32 w-full bg-gray-200 mb-2 flex items-center justify-center">
                  No Image
                </div>
              )}
              <h4 className="font-bold">{s.name}</h4>
              <p>Category: {s.category}</p>
              <p>Price: ${s.price}</p>
              <p>Stock: {s.quantity}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500 flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="bg-red-500 px-2 py-1 text-white rounded hover:bg-red-600 flex items-center gap-1"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button
                  onClick={() => handleRestock(s._id)}
                  className="bg-green-500 px-2 py-1 text-white rounded hover:bg-green-600"
                >
                  +5
                </button>
                <button
                  onClick={() => handleDecrease(s._id)}
                  className="bg-gray-500 px-2 py-1 text-white rounded hover:bg-gray-600"
                >
                  -1
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
