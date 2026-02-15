import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, ADMIN_EMAILS } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import type { Product } from "../data/products";
import { Navigate } from "react-router-dom";

type Category = "groceries" | "electronics";

const EMPTY_FORM = { name: "", price: "", weight: "" };

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function compressImage(file: File, maxWidth = 800, quality = 0.7): Promise<string> {
  const base64 = await fileToBase64(file);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width;
      let h = img.height;
      if (w > maxWidth) {
        h = (h * maxWidth) / w;
        w = maxWidth;
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/webp", quality));
    };
    img.src = base64;
  });
}

export default function Admin() {
  const { user } = useAuth();
  const [category, setCategory] = useState<Category>("groceries");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editImages, setEditImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false;

  // Redirect non-admins
  if (!user || !isAdmin) return <Navigate to="/" />;

  // Fetch products when category changes
  useEffect(() => {
    setLoading(true);
    getDocs(collection(db, category)).then((snap) => {
      setProducts(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product))
      );
      setLoading(false);
    });
  }, [category]);

  function resetForm() {
    setForm(EMPTY_FORM);
    setFiles([]);
    setEditingId(null);
    setEditImages([]);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    if (!selected) return;
    const arr = Array.from(selected).slice(0, 2);
    setFiles(arr);
  }

  async function convertFiles(productFiles: File[]): Promise<string[]> {
    const results: string[] = [];
    for (const file of productFiles) {
      const compressed = await compressImage(file);
      results.push(compressed);
    }
    return results;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price || !form.weight) return;

    setSaving(true);

    try {
      if (editingId) {
        // Editing existing product
        let images = editImages;
        if (files.length > 0) {
          images = await convertFiles(files);
        }

        const data = {
          name: form.name,
          price: Number(form.price),
          weight: form.weight,
          images,
        };
        await updateDoc(doc(db, category, editingId), data);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...data } : p))
        );
      } else {
        // Adding new product
        if (files.length === 0) {
          setSaving(false);
          return;
        }
        const images = await convertFiles(files);
        const data = {
          name: form.name,
          price: Number(form.price),
          weight: form.weight,
          images,
        };
        const docRef = await addDoc(collection(db, category), data);
        setProducts((prev) => [...prev, { id: docRef.id, ...data }]);
      }

      resetForm();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save. Check console for details.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      price: product.price != null ? String(product.price) : "",
      weight: product.weight || "",
    });
    setEditImages(product.images || []);
    setFiles([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Delete "${product.name}"?`)) return;

    await deleteDoc(doc(db, category, product.id));
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  }

  return (
    <div className="admin-page">
      <h1 className="page-title">Admin Panel</h1>
      <p className="page-subtitle">Manage products across categories</p>

      {/* Category selector */}
      <div className="admin-category-selector">
        <label className="admin-label">Category</label>
        <select
          className="admin-select"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as Category);
            resetForm();
          }}
        >
          <option value="groceries">Groceries</option>
          <option value="electronics">Electronics</option>
        </select>
      </div>

      {/* Add / Edit form */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <h2 className="admin-form-title">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="admin-field">
          <label className="admin-label">Title *</label>
          <input
            className="admin-input"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Product name"
            required
          />
        </div>

        <div className="admin-row">
          <div className="admin-field">
            <label className="admin-label">Price (Rs.) *</label>
            <input
              className="admin-input"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          <div className="admin-field">
            <label className="admin-label">Weight *</label>
            <input
              className="admin-input"
              type="text"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              placeholder="e.g. 500g, 1kg, 200ml"
              required
            />
          </div>
        </div>

        <div className="admin-field">
          <label className="admin-label">
            Pictures (max 2) {editingId ? "" : "*"}
          </label>
          {editingId && editImages.length > 0 && files.length === 0 && (
            <div className="admin-current-images">
              {editImages.map((url, i) => (
                <img key={i} src={url} alt="" className="admin-thumb" />
              ))}
              <p className="admin-hint">Upload new files to replace</p>
            </div>
          )}
          <div className="admin-file-wrapper">
            <label className="admin-file-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Choose files
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                required={!editingId && files.length === 0}
              />
            </label>
            <span className="admin-file-names">
              {files.length > 0
                ? files.map((f) => f.name).join(", ")
                : "No files chosen"}
            </span>
          </div>
        </div>

        <div className="admin-form-actions">
          <button className="admin-submit" type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button
              className="admin-cancel"
              type="button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Product list */}
      <h2 className="admin-list-title">
        {category === "groceries" ? "Groceries" : "Electronics"} ({products.length})
      </h2>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : products.length === 0 ? (
        <p className="admin-empty">No products yet. Add one above.</p>
      ) : (
        <div className="admin-product-list">
          {products.map((p) => (
            <div key={p.id} className="admin-product-row">
              <div className="admin-product-thumb-wrap">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt="" className="admin-product-img" />
                ) : (
                  <div className="admin-product-img-placeholder">No img</div>
                )}
              </div>
              <div className="admin-product-info">
                <p className="admin-product-name">{p.name}</p>
                <p className="admin-product-meta">
                  Rs. {p.price.toLocaleString()} &middot; {p.weight}
                </p>
              </div>
              <div className="admin-product-actions">
                <button className="admin-edit-btn" onClick={() => startEdit(p)}>
                  Edit
                </button>
                <button className="admin-delete-btn" onClick={() => handleDelete(p)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
