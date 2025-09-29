import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "https://fitness-store-backend.onrender.com";

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setForm({ ...form, image: data.imageUrl });
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  // Add / Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          alert("Product updated successfully!");
        }
      } else {
        const res = await fetch(`${API_URL}/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          alert("Product added successfully!");
        }
      }
      setForm({ name: "", description: "", price: "", image: "" });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" });
      alert("Product deleted!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
    });
    setEditingId(product._id);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Admin Dashboard</h1>

      {/* Link to Orders Page */}
      <div className="mb-6 text-center">
        <Link
          to="/admin/orders"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📦 View All Orders
        </Link>
      </div>

      {/* Add / Update Product Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3 mb-6 border p-4 rounded shadow-md bg-gray-50"
      >
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageUpload}
          className="border p-2 w-full rounded"
        />
        {form.image && (
          <img
            src={`${API_URL}${form.image}`}
            alt="preview"
            className="h-12 w-12 mt-2 rounded object-cover border"
          />
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {editingId ? "✏️ Update Product" : "➕ Add Product"}
        </button>
      </form>

      {/* Product List in Table */}
      <h2 className="text-xl font-semibold mb-3">All Products</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="text-center">
              <td className="border px-4 py-2">{p.name}</td>
              <td className="border px-4 py-2">{p.description}</td>
              <td className="border px-4 py-2">₹{p.price}</td>
              <td className="border px-4 py-2">
                {p.image && (
                  <img
                    src={`${API_URL}${p.image}`}
                    alt={p.name}
                    className="h-8 w-8 mx-auto rounded object-cover border"
                  />
                )}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={(e) => { e.preventDefault(); handleEdit(p); }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
