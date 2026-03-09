import { useState, useEffect, useRef } from 'react';
import { productAPI } from '../../api/index.js';
import api from '../../api/axiosInstance.js';
import { Button, Input, Card, Alert, Spinner } from '../../components/ui/index.jsx';
import AdminLayout from '../../components/admin/AdminLayout.jsx';

const EMPTY_FORM = {
  name: '', description: '', price: '', category: '',
  stock: '', brand: '', imageUrl: '', imageAlt: '',
};

const CATEGORIES = [
  'electronics', 'clothing', 'footwear', 'kitchen',
  'books', 'tools', 'sports', 'beauty', 'furniture', 'toys', 'other'
];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const fileInputRef = useRef();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productAPI.getAll({ page, limit: 10 });
      setProducts(data.products);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview('');
    setUploadedImageUrl('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openCreate = () => { resetForm(); setEditingId(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description, price: p.price,
      category: p.category, stock: p.stock, brand: p.brand || '',
      imageUrl: p.images?.[0]?.url || '', imageAlt: p.images?.[0]?.alt || '',
    });
    setImagePreview(p.images?.[0]?.url || '');
    setUploadedImageUrl(p.images?.[0]?.url || '');
    setImageFile(null);
    setError('');
    setEditingId(p._id);
    setShowForm(true);
  };

  // Handle image file selection → preview
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPEG, PNG, WebP images allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB');
      return;
    }

    setImageFile(file);
    setUploadedImageUrl(''); // Reset uploaded URL when new file selected
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
    setError('');
  };

  // Upload image to Cloudinary via backend
  const handleUploadImage = async () => {
    if (!imageFile) return;
    setUploadingImage(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('alt', form.name || 'product image');

      const { data } = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadedImageUrl(data.image.url);
      setSuccess('Image uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Determine final image URL
    const finalImageUrl = uploadedImageUrl || form.imageUrl;
    if (!finalImageUrl) {
      setError('Please add a product image (upload or paste URL)');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category.toLowerCase(),
        stock: Number(form.stock),
        brand: form.brand,
        images: [{ url: finalImageUrl, alt: form.imageAlt || form.name }],
      };

      if (editingId) await productAPI.update(editingId, payload);
      else await productAPI.create(payload);

      setSuccess(editingId ? 'Product updated!' : 'Product created!');
      setShowForm(false);
      resetForm();
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await productAPI.delete(id);
      setSuccess('Product deleted');
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{pagination.totalProducts || 0} total products</p>
        </div>
        <Button onClick={openCreate}>+ Add Product</Button>
      </div>

      {success && <Alert type="success" message={success} />}
      {!showForm && error && <Alert message={error} />}

      {/* ─── Product Form Modal ─── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="font-display text-xl font-bold text-gray-900">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => { setShowForm(false); resetForm(); }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-lg transition-colors">✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Image Upload Section */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Product Image *</label>

                {/* Preview */}
                {imagePreview && (
                  <div className="mb-3 relative inline-block">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-gray-200" />
                    {uploadedImageUrl && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">✓</div>
                    )}
                  </div>
                )}

                {/* Tab: Upload File or Paste URL */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Upload File */}
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Option 1 — Upload from computer</p>
                    <div className="flex gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center hover:border-purple-400 hover:bg-purple-50 transition-all">
                          <span className="text-sm text-gray-500">
                            {imageFile ? `📎 ${imageFile.name}` : '📁 Click to choose image'}
                          </span>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleUploadImage}
                        loading={uploadingImage}
                        disabled={!imageFile || uploadingImage}
                        className="whitespace-nowrap"
                      >
                        {uploadedImageUrl && imageFile ? '✓ Uploaded' : 'Upload'}
                      </Button>
                    </div>
                    {uploadedImageUrl && (
                      <p className="text-xs text-green-600 mt-1 font-medium">✓ Image uploaded to Cloudinary</p>
                    )}
                  </div>

                  {/* Paste URL */}
                  <div className="p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Option 2 — Paste image URL</p>
                    <input
                      type="url"
                      value={form.imageUrl}
                      onChange={(e) => {
                        setForm({ ...form, imageUrl: e.target.value });
                        if (e.target.value) setImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/product.jpg"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <Input
                label="Product Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. boAt Airdopes 141"
                required
              />

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Description *</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 resize-none h-28"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the product features, specs, etc."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (₹) *"
                  type="number" min="0" step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="1299"
                  required
                />
                <Input
                  label="Stock Quantity *"
                  type="number" min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 bg-white capitalize"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Brand"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="e.g. Samsung, Nike"
                />
              </div>

              {error && <Alert message={error} />}

              <div className="flex gap-3 pt-1">
                <Button type="submit" loading={saving} className="flex-1">
                  {editingId ? 'Update Product' : 'Create Product'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => { setShowForm(false); resetForm(); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ─── Products Table ─── */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <Card className="overflow-hidden mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Stock</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400">No products yet. Click "+ Add Product" to get started.</td></tr>
                ) : products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]?.url || `https://picsum.photos/seed/${p._id}/60/60`}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-100"
                          onError={(e) => { e.target.src = `https://picsum.photos/seed/${p._id}/60/60`; }}
                        />
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1 max-w-[200px]">{p.name}</p>
                          {p.brand && <p className="text-xs text-gray-400">{p.brand}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">₹{p.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold text-sm ${p.stock === 0 ? 'text-red-600' : p.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {p.stock === 0 ? 'Out of Stock' : p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openEdit(p)}>Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(p._id, p.name)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
              <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">← Prev</button>
              <span className="px-3 py-1.5 text-sm text-gray-500">{page} of {pagination.totalPages}</span>
              <button onClick={() => setPage((p) => p + 1)} disabled={page >= pagination.totalPages} className="px-3 py-1.5 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">Next →</button>
            </div>
          )}
        </Card>
      )}
    </AdminLayout>
  );
}