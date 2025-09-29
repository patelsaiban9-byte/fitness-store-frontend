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

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

  // Handle input changes
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
      if (res.ok || res.status === 200) {
        // Ensure correct path for preview
        setForm({ ...form, image: data.imageUrl.replace(/^\/+/, "/") });
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  // Add or update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      alert("Please upload an image first");
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/api/products/${editingId}`
        : `${API_URL}/api/products`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok || res.status === 200 || res.status === 201) {
        alert(editingId ? "Product updated!" : "Product added!");
        setForm({ name: "", description: "", price: "", image: "" });
        setEditingId(null);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Product deleted!");
        fetchProducts();
      }
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

  // Fix image URL for preview
  const getImageUrl = (img) => {
    if (!img) return "";
    const trimmed = img.startsWith("/") ? img.slice(1) : img;
    return `${API_URL}/${trimmed}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Admin Dashboard</h1>

      {/* Orders Link */}
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
        <div>
          <label htmlFor="name" className="block font-medium">Product Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="description" className="block font-medium">Description</label>
          <input
            id="description"
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="price" className="block font-medium">Price</label>
          <input
            id="price"
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block font-medium">Product Image</label>
          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="border p-2 w-full rounded"
            required={!editingId}
          />
          {form.image && (
            <img
              src={getImageUrl(form.image)}
              alt="preview"
              className="h-12 w-12 mt-2 rounded object-cover border"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {editingId ? "✏️ Update Product" : "➕ Add Product"}
        </button>
      </form>

      {/* Product List */}
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
                    src={getImageUrl(p.image)}
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
