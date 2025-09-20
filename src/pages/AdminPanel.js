import { useState } from "react";
import API from "../api/api";

export default function AdminPanel({ fetchSweets }) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    quantity: "",
    image: ""
  });
  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file); // converts to base64
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/sweets/${form.id}`, form);
      } else {
        await API.post("/sweets", form);
      }
      fetchSweets();
      setForm({ id: "", name: "", category: "", price: "", quantity: "", image: "" });
      setEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Error saving sweet");
    }
  };

  const handleEdit = (sweet) => {
    setForm({
      id: sweet._id,
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      image: sweet.image || ""
    });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sweet?")) return;
    try {
      await API.delete(`/sweets/${id}`);
      fetchSweets();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting sweet");
    }
  };

  return (
    <div className="mb-6 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">{editing ? "Edit Sweet" : "Add New Sweet"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input type="text" name="name" className="border p-2 rounded w-full" value={form.name} onChange={handleChange} required />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <input type="text" name="category" className="border p-2 rounded w-full" value={form.category} onChange={handleChange} required />
        </div>

        <div>
          <label className="block font-medium mb-1">Price</label>
          <input type="number" name="price" className="border p-2 rounded w-full" value={form.price} onChange={handleChange} required />
        </div>

        <div>
          <label className="block font-medium mb-1">Quantity</label>
          <input type="number" name="quantity" className="border p-2 rounded w-full" value={form.quantity} onChange={handleChange} required />
        </div>

        <div>
          <label className="block font-medium mb-1">Image</label>
          <input type="file" accept="image/*" onChange={handleImage} className="w-full" />
        </div>

        <button className="bg-purple-500 text-white py-2 rounded hover:bg-purple-600 transition">
          {editing ? "Update Sweet" : "Add Sweet"}
        </button>
      </form>

      <div className="mt-6">
        <h3 className="font-bold mb-2">Existing Sweets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fetchSweets && fetchSweets.sweets?.map(s => (
            <div key={s._id} className="bg-gray-100 p-2 rounded shadow flex flex-col items-center">
              {s.image && <img src={s.image} alt={s.name} className="h-20 w-20 object-cover mb-2 rounded" />}
              <h4 className="font-bold">{s.name}</h4>
              <p>{s.category}</p>
              <p>${s.price}</p>
              <p>Stock: {s.quantity}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleEdit(s)} className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500">Edit</button>
                <button onClick={() => handleDelete(s._id)} className="bg-red-500 px-2 py-1 text-white rounded hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
