import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Plus, Search, Edit3, Trash2, Upload, ChevronDown,
  X, Save, Package, Tag, AlertTriangle,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import Badge from '@/components/ui/Badge';
import { Product } from '@/types';
import api from '@/lib/api';
import { staggerContainer, fadeUp, scalePop, drawerSlide, overlayFade } from '@/lib/motion-variants';
import { TableRowSkeleton } from '@/components/ui/Skeleton';

type InventoryProduct = Product & { _editing?: boolean };

const LOW_STOCK_THRESHOLD = 15;

export default function InventoryPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editProduct, setEditProduct] = useState<InventoryProduct | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);

  // Form State
  const [formState, setFormState] = useState({
    name: '',
    slug: '',
    category: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    badge: '',
    description: '',
    sizes: '',
    tags: '',
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await api.get('/products');
        const productList = res.data?.products || res.data || [];
        setProducts(productList);
        const cats = Array.from(
          new Set(productList.map((p: any) => p.category || p.Category?.name).filter(Boolean))
        ) as string[];
        setCategories(['All', ...cats]);
      } catch (err) {
        console.error('Failed to fetch inventory', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  useEffect(() => {
    if (editProduct) {
      setFormState({
        name: editProduct.name || '',
        slug: editProduct.slug || '',
        category: editProduct.category || (editProduct as any).Category?.name || '',
        price: editProduct.price || (editProduct as any).basePrice || 0,
        originalPrice: editProduct.originalPrice || 0,
        stock: editProduct.stock || 0,
        badge: editProduct.badge || '',
        description: editProduct.description || '',
        sizes: editProduct.variants?.sizes?.join(', ') || '',
        tags: editProduct.tags?.join(', ') || '',
      });
      const firstImage = editProduct.images?.[0];
      const imgUrl = typeof firstImage === 'object' ? (firstImage as any).imageUrl || (firstImage as any).url : firstImage;
      setImagePreview(imgUrl || '');
      setSelectedImageFile(null);
    } else {
      setFormState({
        name: '',
        slug: '',
        category: '',
        price: 0,
        originalPrice: 0,
        stock: 0,
        badge: '',
        description: '',
        sizes: '',
        tags: '',
      });
      setImagePreview('');
      setSelectedImageFile(null);
    }
  }, [editProduct]);

  useEffect(() => {
    if (showAddForm) {
      setEditProduct(null);
      setFormState({
        name: '',
        slug: '',
        category: '',
        price: 0,
        originalPrice: 0,
        stock: 0,
        badge: '',
        description: '',
        sizes: '',
        tags: '',
      });
      setImagePreview('');
      setSelectedImageFile(null);
    }
  }, [showAddForm]);

  const filtered = products.filter((p) => {
    const categoryName = p.category || (p as any).Category?.name || 'Uncategorized';
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      categoryName.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'All' || categoryName === categoryFilter;
    return matchSearch && matchCat;
  });

  const toggleBulk = (id: string) => {
    setBulkSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const deleteSelected = async () => {
    try {
      await Promise.all(bulkSelected.map(id => api.delete(`/admin/products/${id}`)));
      setProducts((p) => p.filter((prod) => !bulkSelected.includes(prod.id)));
      setBulkSelected([]);
    } catch (err) {
      console.error('Failed to bulk delete', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const saveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('slug', formState.slug);
      formData.append('category', formState.category);
      formData.append('basePrice', String(formState.price));
      formData.append('price', String(formState.price));
      if (formState.originalPrice) {
        formData.append('originalPrice', String(formState.originalPrice));
      }
      formData.append('stock', String(formState.stock));
      formData.append('badge', formState.badge);
      formData.append('description', formState.description);
      
      const parsedTags = formState.tags.split(',').map(t => t.trim()).filter(Boolean);
      const parsedSizes = formState.sizes.split(',').map(s => s.trim()).filter(Boolean);
      
      formData.append('tags', JSON.stringify(parsedTags));
      formData.append('variants', JSON.stringify({ sizes: parsedSizes }));

      if (selectedImageFile) {
        formData.append('images', selectedImageFile);
      }

      if (editProduct) {
        const res = await api.put(`/admin/products/${editProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const updated = res.data?.product || res.data;
        setProducts((prev) => prev.map((p) => (p.id === editProduct.id ? { ...p, ...updated } : p)));
      } else {
        const res = await api.post('/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const created = res.data?.product || res.data;
        setProducts((prev) => [created, ...prev]);
      }
      setEditProduct(null);
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to save product', err);
    }
  };

  const lowStockCount = products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD).length;

  return (
    <>
      <Head>
        <title>Inventory Management – Aitherios Admin</title>
        <meta name="description" content="Manage Aitherios product inventory." />
      </Head>

      <AdminLayout>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display font-bold text-2xl text-white">Inventory</h1>
              <p className="text-sm text-steel-300 mt-1">
                {products.length} products · {' '}
                {lowStockCount > 0 && (
                  <span className="text-amber-400 font-semibold">{lowStockCount} low stock</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {bulkSelected.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs text-steel-300">{bulkSelected.length} selected</span>
                  <button
                    onClick={deleteSelected}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-display font-bold hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={12} /> Delete Selected
                  </button>
                </motion.div>
              )}
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(255,0,0,0.4)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-crimson-500 text-white rounded-xl text-sm font-display font-bold tracking-wider uppercase hover:bg-crimson-600 transition-all shadow-glow-sm"
              >
                <Plus size={16} /> Add Product
              </motion.button>
            </div>
          </motion.div>

          {/* Low stock alert */}
          {lowStockCount > 0 && (
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 px-4 py-3 bg-amber-500/8 border border-amber-500/20 rounded-xl text-sm"
            >
              <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />
              <p className="text-amber-300">
                <strong>{lowStockCount} products</strong> are running low on stock (≤{LOW_STOCK_THRESHOLD} units).
              </p>
            </motion.div>
          )}

          {/* Toolbar */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-400" />
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full glass border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-steel-400 focus:outline-none focus:border-crimson-500 transition-all"
                aria-label="Search inventory"
              />
            </div>
            {/* Category filter */}
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold tracking-wider uppercase transition-all ${
                    categoryFilter === cat
                      ? 'bg-crimson-500 text-white'
                      : 'glass text-steel-300 hover:text-white border border-white/10'
                  }`}
                  aria-pressed={categoryFilter === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Table */}
          <motion.div variants={fadeUp} className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left px-4 py-3 text-xs font-display font-bold tracking-widest uppercase text-steel-300">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          setBulkSelected(e.target.checked ? filtered.map((p) => p.id) : [])
                        }
                        checked={bulkSelected.length === filtered.length && filtered.length > 0}
                        className="accent-crimson-500 rounded"
                        aria-label="Select all products"
                      />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-display font-bold tracking-widest uppercase text-steel-300">
                      Product
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-display font-bold tracking-widest uppercase text-steel-300 hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-display font-bold tracking-widest uppercase text-steel-300">
                      Price
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-display font-bold tracking-widest uppercase text-steel-300 hidden sm:table-cell">
                      Stock
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-display font-bold tracking-widest uppercase text-steel-300 hidden lg:table-cell">
                      Tags
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-display font-bold tracking-widest uppercase text-steel-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td colSpan={7} className="p-0">
                            <TableRowSkeleton />
                          </td>
                        </tr>
                      ))
                    ) : filtered.map((product, idx) => {
                      const isLow = product.stock <= LOW_STOCK_THRESHOLD;
                      return (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className={`border-b border-white/5 hover:bg-white/3 transition-colors ${
                            bulkSelected.includes(product.id) ? 'bg-crimson-500/5' : ''
                          }`}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={bulkSelected.includes(product.id)}
                              onChange={() => toggleBulk(product.id)}
                              className="accent-crimson-500"
                              aria-label={`Select ${product.name}`}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-obsidian-300 flex-shrink-0">
                                <Image
                                  src={
                                    (typeof product.images?.[0] === 'object'
                                      ? (product.images[0] as any).imageUrl || (product.images[0] as any).url
                                      : product.images?.[0]) || 'https://via.placeholder.com/40'
                                  }
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-display font-semibold text-white text-sm truncate max-w-[160px]">
                                  {product.name}
                                </p>
                                <p className="text-xs text-steel-400 truncate">{product.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="text-sm text-steel-300">
                              {product.category || (product as any).Category?.name || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-display font-bold text-white text-sm">
                                ${product.price || (product as any).basePrice}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-steel-500 line-through">${product.originalPrice}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-semibold ${isLow ? 'text-amber-400' : 'text-white'}`}>
                                {product.stock}
                              </span>
                              {isLow && <AlertTriangle size={12} className="text-amber-400" />}
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {product.tags?.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="default" className="text-[10px]">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditProduct(product)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-steel-300 hover:text-white hover:bg-white/5 transition-all"
                                aria-label={`Edit ${product.name}`}
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(product.id)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-steel-400 hover:text-crimson-500 hover:bg-crimson-500/5 transition-all"
                                aria-label={`Delete ${product.name}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>

              {!loading && filtered.length === 0 && (
                <div className="text-center py-16">
                  <Package size={36} className="text-steel-500 mx-auto mb-3" />
                  <p className="font-display font-bold text-white">No products found</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Edit / Add Product Drawer ─────────────────────── */}
        <AnimatePresence>
          {(editProduct || showAddForm) && (
            <>
              <motion.div
                variants={overlayFade}
                initial="closed"
                animate="open"
                exit="exit"
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                onClick={() => { setEditProduct(null); setShowAddForm(false); }}
                aria-hidden="true"
              />
              <motion.aside
                variants={drawerSlide}
                initial="closed"
                animate="open"
                exit="exit"
                className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg flex flex-col"
                style={{ background: 'rgba(0,0,0,0.97)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
                role="dialog"
                aria-label={editProduct ? 'Edit product' : 'Add product'}
              >
                {/* Drawer header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
                  <h2 className="font-display font-bold text-lg text-white">
                    {editProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={() => { setEditProduct(null); setShowAddForm(false); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-steel-300 hover:text-white hover:bg-white/5 transition-all"
                    aria-label="Close panel"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 no-scrollbar">
                  {/* Image upload placeholder */}
                  <div>
                    <p className="text-xs font-display font-bold tracking-widest uppercase text-steel-200 mb-2">
                      Product Image
                    </p>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/15 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-crimson-500/40 transition-colors cursor-pointer group"
                    >
                      {imagePreview ? (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden">
                          <Image src={imagePreview} alt="" fill className="object-cover" sizes="96px" />
                        </div>
                      ) : (
                        <Upload size={24} className="text-steel-500 group-hover:text-crimson-400 transition-colors" />
                      )}
                      <p className="text-xs text-steel-400 group-hover:text-steel-300 transition-colors">
                        Drop image here or <span className="text-crimson-400">browse</span>
                      </p>
                      <p className="text-[10px] text-steel-500">WebP, PNG, JPG · Max 5MB</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        aria-label="Upload product image"
                      />
                    </div>
                  </div>

                  {/* Fields */}
                  {[
                    { label: 'Product Name', key: 'name', placeholder: 'e.g. Void Runner X2' },
                    { label: 'Slug', key: 'slug', placeholder: 'e.g. void-runner-x2' },
                    { label: 'Category', key: 'category', placeholder: 'e.g. Footwear' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs font-display font-bold tracking-widest uppercase text-steel-200 block mb-1.5">
                        {label}
                      </label>
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={formState[key as keyof typeof formState] || ''}
                        onChange={(e) => setFormState(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-steel-400 focus:outline-none focus:border-crimson-500 transition-all"
                      />
                    </div>
                  ))}

                  {/* Price + Stock row */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Price ($)', key: 'price', type: 'number' },
                      { label: 'Original Price ($)', key: 'originalPrice', type: 'number' },
                      { label: 'Stock', key: 'stock', type: 'number' },
                      { label: 'Badge', key: 'badge', type: 'text' },
                    ].map(({ label, key, type }) => (
                      <div key={key}>
                        <label className="text-xs font-display font-bold tracking-widest uppercase text-steel-200 block mb-1.5">
                          {label}
                        </label>
                        <input
                          type={type}
                          value={formState[key as keyof typeof formState] || ''}
                          onChange={(e) => setFormState(prev => ({ ...prev, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                          className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-crimson-500 transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-display font-bold tracking-widest uppercase text-steel-200 block mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={formState.description || ''}
                      onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full glass border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-steel-400 focus:outline-none focus:border-crimson-500 transition-all resize-none"
                      placeholder="Product description..."
                    />
                  </div>

                  {/* Variants */}
                  <div>
                    <p className="text-xs font-display font-bold tracking-widest uppercase text-steel-200 mb-2 flex items-center gap-2">
                      <Tag size={12} /> Variants
                    </p>
                    <div className="glass rounded-xl p-4 space-y-3">
                      <div>
                        <label className="text-xs text-steel-300 block mb-1">Sizes (comma-separated)</label>
                        <input
                          type="text"
                          value={formState.sizes || ''}
                          onChange={(e) => setFormState(prev => ({ ...prev, sizes: e.target.value }))}
                          placeholder="XS, S, M, L, XL"
                          className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-crimson-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-steel-300 block mb-1">Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={formState.tags || ''}
                          onChange={(e) => setFormState(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="new, limited, bestseller"
                          className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-crimson-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="px-6 py-4 border-t border-white/8 flex gap-3">
                  <button
                    onClick={() => { setEditProduct(null); setShowAddForm(false); }}
                    className="flex-1 py-2.5 glass border border-white/15 rounded-xl text-sm font-display font-bold text-steel-200 hover:text-white hover:border-white/30 transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(255,0,0,0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveEdit}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-crimson-500 rounded-xl text-sm font-display font-bold text-white hover:bg-crimson-600 transition-all shadow-glow-sm"
                  >
                    <Save size={15} /> Save Product
                  </motion.button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── Delete Confirmation Modal ─────────────────────── */}
        <AnimatePresence>
          {deleteConfirm && (
            <>
              <motion.div
                variants={overlayFade}
                initial="closed"
                animate="open"
                exit="exit"
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
                onClick={() => setDeleteConfirm(null)}
              >
                <motion.div
                  variants={scalePop}
                  initial="hidden"
                  animate="visible"
                  className="glass rounded-2xl p-6 max-w-sm w-full border border-crimson-500/20"
                  onClick={(e) => e.stopPropagation()}
                  role="alertdialog"
                  aria-label="Delete confirmation"
                >
                  <div className="w-12 h-12 rounded-xl bg-crimson-500/10 flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={20} className="text-crimson-400" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-white text-center mb-2">
                    Delete Product?
                  </h3>
                  <p className="text-steel-300 text-sm text-center mb-6">
                    This action cannot be undone. The product will be permanently removed.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 py-2.5 glass border border-white/15 rounded-xl text-sm font-display font-bold text-steel-200 hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => deleteProduct(deleteConfirm)}
                      className="flex-1 py-2.5 bg-crimson-500 rounded-xl text-sm font-display font-bold text-white hover:bg-crimson-600 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </AdminLayout>
    </>
  );
}
