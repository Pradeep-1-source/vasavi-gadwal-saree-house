import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  FolderTree, 
  MessageSquare, 
  Settings, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Truck, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Lock,
  UploadCloud,
  Image as ImageIcon,
  Star,
  Loader2,
  Sparkles,
  Upload
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Product, Order, Category, Review, SiteSettings, OrderStatus, PaymentStatus } from '../../types';
import { uploadSareeImage } from '../../utils/imageUpload';

interface AdminDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { user, isAdmin, switchDemoRole } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'categories' | 'reviews' | 'settings'>('overview');
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    delivery_charge: 100,
    free_delivery_threshold: 15000,
    support_phone: '7660833168',
    whatsapp_number: '917660833168',
    announcement_bar: '✨ Handcrafted Gadwal Heritage Weaves | Flat ₹100 Express Delivery Across India',
    is_announcement_enabled: true,
  });

  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Product modal state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);

  // Category modal state
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isUploadingCatImage, setIsUploadingCatImage] = useState(false);

  // Selected order details modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    const [prods, ords, cats, revs, sets] = await Promise.all([
      api.getProducts(),
      api.getAllOrders(),
      api.getCategories(),
      api.getReviews(),
      api.getSettings(),
    ]);
    setProducts(prods);
    setOrders(ords);
    setCategories(cats);
    setReviews(revs);
    setSettings(sets);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Total sales calculated strictly from verified payments (Paid)
  const totalSales = orders
    .filter((o) => o.payment_status === 'Paid')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const pendingOrdersCount = orders.filter((o) => o.order_status === 'Pending').length;
  const lowStockProducts = products.filter((p) => p.stock_quantity <= 2);

  // PRODUCT ACTIONS & IMAGE UPLOAD
  const handlePhotoFiles = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0 || !editingProduct) return;
    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter((f) => f.type.startsWith('image/'));
      if (validFiles.length === 0) {
        setUploadError('Please select valid image files (JPG, PNG, WEBP).');
        setIsUploadingImage(false);
        return;
      }

      const existingImages = [...(editingProduct.images || [])];

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const imageUrl = await uploadSareeImage(file);
        existingImages.push({
          id: 'img-' + Date.now() + '-' + i,
          image_url: imageUrl,
          alt_text: editingProduct.name || file.name.replace(/\.[^/.]+$/, ''),
          display_order: existingImages.length + 1,
        });
      }

      setEditingProduct({
        ...editingProduct,
        images: existingImages,
      });
    } catch (err: any) {
      console.error('Failed to upload saree image:', err);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    if (!editingProduct) return;
    const updated = [...(editingProduct.images || [])];
    updated.splice(index, 1);
    const reindexed = updated.map((img, idx) => ({ ...img, display_order: idx + 1 }));
    setEditingProduct({ ...editingProduct, images: reindexed });
  };

  const handleSetCoverPhoto = (index: number) => {
    if (!editingProduct || !editingProduct.images || editingProduct.images.length <= 1) return;
    const current = [...editingProduct.images];
    const [chosen] = current.splice(index, 1);
    current.unshift(chosen);
    const reindexed = current.map((img, idx) => ({ ...img, display_order: idx + 1 }));
    setEditingProduct({ ...editingProduct, images: reindexed });
  };

  const handleCategoryPhoto = async (files: FileList | null) => {
    if (!files || files.length === 0 || !editingCategory) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;
    setIsUploadingCatImage(true);
    try {
      const url = await uploadSareeImage(file);
      setEditingCategory({ ...editingCategory, image_url: url });
    } catch (err) {
      console.error('Failed to upload category image:', err);
    } finally {
      setIsUploadingCatImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.images || editingProduct.images.length === 0 || !editingProduct.images[0]?.image_url) {
      alert('Please upload at least one saree photo before saving.');
      return;
    }
    await api.saveProduct(editingProduct);
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setUploadError(null);
    loadAllData();
  };

  const handleDeleteProduct = async (id: string, name?: string) => {
    const confirmMsg = name
      ? `Are you sure you want to permanently delete "${name}" from the active catalogue?`
      : 'Are you sure you want to remove this saree from the active catalogue?';
    if (window.confirm(confirmMsg)) {
      await api.deleteProduct(id);
      loadAllData();
    }
  };

  // ORDER ACTIONS
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await api.updateOrderStatus(orderId, status);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, order_status: status });
    }
    loadAllData();
  };

  const handleUpdatePaymentStatus = async (orderId: string, status: PaymentStatus) => {
    await api.updatePaymentStatus(orderId, status);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, payment_status: status });
    }
    loadAllData();
  };

  // CATEGORY ACTIONS
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    await api.saveCategory(editingCategory);
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    loadAllData();
  };

  // REVIEW ACTIONS
  const handleToggleReviewApproval = async (id: string, current: boolean) => {
    await api.updateReviewStatus(id, !current);
    loadAllData();
  };

  // SETTINGS SAVE
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.updateSettings(settings);
    alert('Settings saved successfully!');
    loadAllData();
  };

  // Admin protection check
  if (!isAdmin) {
    const handleAdminLoginSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const target = e.target as HTMLFormElement;
      const userVal = (target.elements.namedItem('adminUser') as HTMLInputElement).value;
      const passVal = (target.elements.namedItem('adminPass') as HTMLInputElement).value;
      if (
        (userVal.trim().toLowerCase() === 'vasavi@admin' || userVal.trim().toLowerCase() === 'vasavi@admin.com') && 
        passVal === 'vasavi@112'
      ) {
        switchDemoRole('admin');
        loadAllData();
      } else {
        alert('Invalid admin credentials. Access denied.');
      }
    };

    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#58101E] text-amber-200 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="font-serif font-bold text-2xl text-stone-900">
            Store Administration Login
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Vasavi Gadwal Saree House • Authorized Management Only
          </p>
        </div>

        <form onSubmit={handleAdminLoginSubmit} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 text-xs text-left">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Username / Email</label>
            <input
              type="text"
              name="adminUser"
              required
              placeholder="Admin Username or Email"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Password</label>
            <input
              type="password"
              name="adminPass"
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#58101E] hover:bg-[#801A2D] text-white font-semibold rounded-xl uppercase tracking-wider text-xs transition-colors shadow-md"
          >
            Access Store Dashboard
          </button>
        </form>

        <button
          onClick={() => onNavigate('home')}
          className="text-xs text-stone-500 hover:text-stone-800"
        >
          ← Return to Storefront
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#8E6B2C] mb-1">
              <span>Vasavi Gadwal Saree House</span>
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#420B16]">
              Store Administration
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </button>
            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  sku: `VGSH-${Math.floor(1000 + Math.random() * 9000)}`,
                  price: 15000,
                  compare_at_price: 18000,
                  category_id: categories[0]?.id || 'cat-gadwal-silk',
                  fabric: '100% Pure Mulberry Silk & Zari',
                  colour: 'Maroon & Gold',
                  saree_length: '6.2 Meters (including blouse)',
                  blouse_details: 'Unstitched Contrast Blouse Fabric (80 cm)',
                  stock_quantity: 5,
                  is_featured: false,
                  is_active: true,
                  description: '',
                  images: []
                });
                setUploadError(null);
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#58101E] hover:bg-[#801A2D] text-white text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Saree</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-stone-200">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: `Sarees (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'categories', label: `Categories (${categories.length})`, icon: FolderTree },
            { id: 'reviews', label: `Reviews (${reviews.length})`, icon: MessageSquare },
            { id: 'settings', label: 'Store Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#58101E] text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="py-6 space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Revenue */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Verified Sales
                  </p>
                  <h3 className="font-serif font-bold text-2xl text-[#420B16] mt-1">
                    ₹{totalSales.toLocaleString('en-IN')}
                  </h3>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Paid Orders Only
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#8E6B2C] flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              {/* Total Orders */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Total Orders
                  </p>
                  <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1">
                    {orders.length}
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-1">All time orders placed</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              {/* Pending Orders */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Pending Dispatch
                  </p>
                  <h3 className="font-serif font-bold text-2xl text-amber-700 mt-1">
                    {pendingOrdersCount}
                  </h3>
                  <p className="text-[11px] text-amber-800 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Awaiting processing
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              {/* Active Products */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Active Catalogue
                  </p>
                  <h3 className="font-serif font-bold text-2xl text-stone-900 mt-1">
                    {products.length}
                  </h3>
                  <p className="text-[11px] text-red-600 mt-1">
                    {lowStockProducts.length} low stock weaves
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Recent Customer Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#58101E] font-semibold hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F9F5EC] text-stone-600 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Items</th>
                      <th className="p-3.5">Total Amount</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5">Order Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50">
                        <td className="p-3.5 font-mono font-semibold text-stone-900">
                          {ord.order_number}
                        </td>
                        <td className="p-3.5">
                          <p className="font-semibold text-stone-900">{ord.user_name || ord.address_snapshot.full_name}</p>
                          <p className="text-[11px] text-stone-500">{ord.address_snapshot.city}, {ord.address_snapshot.state}</p>
                        </td>
                        <td className="p-3.5">{ord.items.length} saree(s)</td>
                        <td className="p-3.5 font-semibold text-[#420B16]">
                          ₹{ord.total_amount.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            ord.payment_status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.payment_status}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700">
                            {ord.order_status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="text-xs text-[#58101E] font-semibold hover:underline"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-stone-400">
                          No customer orders placed yet. Place a test order from the shop!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="py-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative max-w-sm flex-1">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter sarees by name, SKU, or fabric..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <span className="text-xs text-stone-500">
                Showing {products.length} sarees
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F9F5EC] text-stone-600 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Saree</th>
                      <th className="p-3.5">SKU</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5">Featured</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products
                      .filter((p) => 
                        !searchFilter ||
                        p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                        p.sku.toLowerCase().includes(searchFilter.toLowerCase())
                      )
                      .map((product) => (
                        <tr key={product.id} className="hover:bg-stone-50">
                          <td className="p-3.5 flex items-center gap-3">
                            <img
                              src={product.images[0]?.image_url}
                              alt=""
                              className="w-10 h-12 object-cover rounded-md border border-stone-200 shrink-0"
                            />
                            <div>
                              <p className="font-serif font-bold text-stone-900 text-sm line-clamp-1">
                                {product.name}
                              </p>
                              <p className="text-[11px] text-stone-500 font-sans line-clamp-1">
                                {product.fabric} • {product.colour}
                              </p>
                            </div>
                          </td>
                          <td className="p-3.5 font-mono text-stone-600">{product.sku}</td>
                          <td className="p-3.5 text-stone-700">{product.category_name || 'Gadwal Silk'}</td>
                          <td className="p-3.5 font-semibold text-[#420B16]">
                            ₹{product.price.toLocaleString('en-IN')}
                            {product.compare_at_price && (
                              <span className="block text-[10px] text-stone-400 line-through">
                                ₹{product.compare_at_price.toLocaleString('en-IN')}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              product.stock_quantity <= 2
                                ? 'bg-red-100 text-red-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {product.stock_quantity} in stock
                            </span>
                          </td>
                          <td className="p-3.5">
                            {product.is_featured ? (
                              <span className="text-amber-600 font-semibold text-[11px]">★ Featured</span>
                            ) : (
                              <span className="text-stone-400 text-[11px]">-</span>
                            )}
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingProduct({ ...product });
                                setIsProductModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                              title="Edit saree"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="px-2.5 py-1.5 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-semibold inline-flex items-center gap-1 border border-red-200 transition-colors"
                              title="Delete saree"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="py-6 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F9F5EC] text-stone-600 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Order Number</th>
                      <th className="p-3.5">Customer & Destination</th>
                      <th className="p-3.5">Total & Delivery</th>
                      <th className="p-3.5">Payment Status</th>
                      <th className="p-3.5">Order Status</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5 text-right">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50">
                        <td className="p-3.5 font-mono font-bold text-stone-900">
                          {ord.order_number}
                        </td>
                        <td className="p-3.5">
                          <p className="font-semibold text-stone-900">{ord.address_snapshot.full_name}</p>
                          <p className="text-[11px] text-stone-500">{ord.address_snapshot.phone}</p>
                          <p className="text-[11px] text-stone-400">{ord.address_snapshot.city}, {ord.address_snapshot.state} - {ord.address_snapshot.pincode}</p>
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-[#420B16]">₹{ord.total_amount.toLocaleString('en-IN')}</p>
                          <p className="text-[10px] text-stone-500">Incl. ₹{ord.delivery_charge} delivery</p>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={ord.payment_status}
                            onChange={(e) => handleUpdatePaymentStatus(ord.id, e.target.value as any)}
                            className="bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs font-semibold"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Failed">Failed</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={ord.order_status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                            className="bg-white border border-stone-200 rounded-lg px-2 py-1 text-xs font-semibold"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-stone-500 text-[11px]">
                          {new Date(ord.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-3 py-1 bg-stone-100 hover:bg-[#58101E] hover:text-white rounded-lg text-xs font-semibold transition-colors"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-stone-400">
                          No orders placed yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="py-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-serif font-bold text-xl text-stone-900">
                Saree Categories
              </h3>
              <button
                onClick={() => {
                  setEditingCategory({
                    name: '',
                    slug: '',
                    description: '',
                    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
                    is_active: true,
                  });
                  setIsCategoryModalOpen(true);
                }}
                className="px-4 py-2 bg-[#58101E] hover:bg-[#801A2D] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="p-4 bg-white rounded-2xl border border-stone-200 flex gap-4 items-center">
                  <img
                    src={c.image_url}
                    alt={c.name}
                    className="w-16 h-16 object-cover rounded-xl border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                      {c.name}
                    </h4>
                    <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                      /{c.slug}
                    </p>
                    <p className="text-xs text-stone-500 line-clamp-1 mt-1">
                      {c.description}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCategory(c);
                      setIsCategoryModalOpen(true);
                    }}
                    className="p-1.5 text-stone-400 hover:text-[#58101E]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="py-6 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900">
                    Customer Reviews Moderation
                  </h3>
                  <p className="text-xs text-stone-500">
                    Ensure authentic, genuine reviews are displayed on product pages.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-stone-100">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-5 flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900">{rev.user_name}</span>
                        <span className="text-amber-500 text-xs">{'★'.repeat(rev.rating)}</span>
                        {rev.product_name && (
                          <span className="text-xs text-[#8E6B2C]">on {rev.product_name}</span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed italic">
                        "{rev.review_text}"
                      </p>
                      <p className="text-[10px] text-stone-400">
                        Submitted: {new Date(rev.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleToggleReviewApproval(rev.id, rev.is_approved)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 ${
                        rev.is_approved
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                      }`}
                    >
                      {rev.is_approved ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      <span>{rev.is_approved ? 'Approved & Visible' : 'Hidden'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SITE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="py-6 max-w-2xl">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  Global Store Configuration
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Manage fixed delivery charges, helpline numbers, and announcement messages.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Standard Delivery Fee (INR) *
                  </label>
                  <input
                    type="number"
                    value={settings.delivery_charge}
                    onChange={(e) => setSettings({ ...settings, delivery_charge: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900"
                    placeholder="100"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">Default is ₹100 per order across India.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Free Delivery Threshold (INR)
                  </label>
                  <input
                    type="number"
                    value={settings.free_delivery_threshold || ''}
                    onChange={(e) => setSettings({ ...settings, free_delivery_threshold: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900"
                    placeholder="15000"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">Orders above this amount get free delivery.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Support Phone Number *
                  </label>
                  <input
                    type="text"
                    value={settings.support_phone}
                    onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    WhatsApp Support Number (with country code) *
                  </label>
                  <input
                    type="text"
                    value={settings.whatsapp_number}
                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Top Announcement Bar Message
                  </label>
                  <textarea
                    rows={2}
                    value={settings.announcement_bar}
                    onChange={(e) => setSettings({ ...settings, announcement_bar: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#58101E] hover:bg-[#801A2D] text-white font-semibold text-xs tracking-wider uppercase shadow-md transition-colors"
                  >
                    Save Store Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT PRODUCT */}
        {isProductModalOpen && editingProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-200">
              <div className="bg-[#58101E] text-white p-5 flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-[#F7F1DC]">
                  {editingProduct.id ? 'Edit Saree Listing' : 'Add New Gadwal Saree'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 rounded-full text-amber-200 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Saree Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      SKU Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.sku || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Price (INR) *
                    </label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price || 0}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Compare at Price (Original INR)
                    </label>
                    <input
                      type="number"
                      value={editingProduct.compare_at_price || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, compare_at_price: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingProduct.stock_quantity ?? 5}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={editingProduct.category_id}
                      onChange={(e) => {
                        const sel = categories.find(c => c.id === e.target.value);
                        setEditingProduct({
                          ...editingProduct,
                          category_id: e.target.value,
                          category_name: sel?.name,
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Colour Palette
                    </label>
                    <input
                      type="text"
                      value={editingProduct.colour || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, colour: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                      placeholder="e.g. Crimson Red & Maroon"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Fabric & Purity
                    </label>
                    <input
                      type="text"
                      value={editingProduct.fabric || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                      placeholder="e.g. 100% Pure Mulberry Silk"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Blouse Details
                    </label>
                    <input
                      type="text"
                      value={editingProduct.blouse_details || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, blouse_details: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                      placeholder="e.g. Attached Contrast Blouse Piece (80 cm)"
                    />
                  </div>
                </div>

                {/* DIRECT SAREE IMAGE UPLOAD (NO URL INPUT) */}
                <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/90">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className="block text-xs font-bold text-stone-800">
                        Saree Photos (Direct Upload) *
                      </label>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Upload high-resolution drape, zari border, or pallu photos directly from your phone/computer.
                      </p>
                    </div>
                    {editingProduct.images && editingProduct.images.length > 0 && (
                      <span className="text-[11px] font-semibold text-[#58101E] bg-[#58101E]/10 px-2.5 py-0.5 rounded-full">
                        {editingProduct.images.length} {editingProduct.images.length === 1 ? 'Photo' : 'Photos'}
                      </span>
                    )}
                  </div>

                  {/* Thumbnail gallery if images exist */}
                  {editingProduct.images && editingProduct.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
                      {editingProduct.images.map((img, idx) => (
                        <div
                          key={img.id || idx}
                          className="group relative rounded-xl border border-stone-200 overflow-hidden bg-white shadow-xs aspect-square"
                        >
                          <img
                            src={img.image_url}
                            alt={img.alt_text || `Saree ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Primary Cover Badge */}
                          {idx === 0 ? (
                            <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#58101E] text-amber-200 text-[10px] font-bold flex items-center gap-1 shadow">
                              <Star className="w-2.5 h-2.5 fill-amber-300" />
                              <span>Cover</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetCoverPhoto(idx)}
                              className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-white/95 hover:bg-white text-stone-700 hover:text-[#58101E] text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity shadow"
                            >
                              Make Cover
                            </button>
                          )}

                          {/* Delete Photo Button */}
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600/90 hover:bg-red-700 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow"
                            title="Delete this photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                          {/* Order indicator */}
                          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-medium backdrop-blur-xs">
                            #{idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Dropzone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingPhoto(true);
                    }}
                    onDragLeave={() => setIsDraggingPhoto(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingPhoto(false);
                      if (e.dataTransfer.files) {
                        handlePhotoFiles(e.dataTransfer.files);
                      }
                    }}
                    className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all bg-white ${
                      isDraggingPhoto
                        ? 'border-[#58101E] bg-[#58101E]/5 scale-[1.01]'
                        : 'border-stone-300 hover:border-[#58101E]/70'
                    }`}
                  >
                    <input
                      type="file"
                      id="saree-photo-file-input"
                      accept="image/*"
                      multiple
                      disabled={isUploadingImage}
                      onChange={(e) => {
                        handlePhotoFiles(e.target.files);
                        e.target.value = '';
                      }}
                      className="hidden"
                    />

                    {isUploadingImage ? (
                      <div className="py-2.5 flex flex-col items-center justify-center gap-1.5">
                        <Loader2 className="w-6 h-6 text-[#58101E] animate-spin" />
                        <p className="text-xs font-semibold text-stone-800">
                          Uploading and optimizing saree photo...
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Please wait a moment
                        </p>
                      </div>
                    ) : (
                      <label
                        htmlFor="saree-photo-file-input"
                        className="cursor-pointer flex flex-col items-center justify-center gap-2 py-1"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#58101E]/10 text-[#58101E] flex items-center justify-center shadow-xs">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-stone-800">
                            <span className="text-[#58101E] underline decoration-amber-500 underline-offset-2">Click to choose image file</span> or drag & drop here
                          </p>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            Supports JPG, PNG, WEBP — upload multiple angles (Pallu, border, full saree)
                          </p>
                        </div>
                      </label>
                    )}
                  </div>

                  {uploadError && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Weave Story & Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                    placeholder="Describe the Kuttu border, zari motifs, pit loom origin..."
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs text-stone-700">
                    <input
                      type="checkbox"
                      checked={editingProduct.is_featured || false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                      className="rounded text-[#58101E]"
                    />
                    <span>Highlight as Featured Saree</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-stone-700">
                    <input
                      type="checkbox"
                      checked={editingProduct.is_active ?? true}
                      onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                      className="rounded text-[#58101E]"
                    />
                    <span>Active in Catalogue</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    {editingProduct.id && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to permanently delete "${editingProduct.name || 'this saree'}" from the active catalogue?`)) {
                            handleDeleteProduct(editingProduct.id!, editingProduct.name);
                            setIsProductModalOpen(false);
                            setEditingProduct(null);
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete This Saree</span>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploadingImage}
                      className="px-6 py-2.5 rounded-xl bg-[#58101E] text-white text-xs font-semibold hover:bg-[#801A2D] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      {isUploadingImage && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{isUploadingImage ? 'Uploading Photos...' : 'Save Saree'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CATEGORY EDIT */}
        {isCategoryModalOpen && editingCategory && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-stone-200 p-6 space-y-4">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {editingCategory.id ? 'Edit Category' : 'Create Category'}
              </h3>
              <form onSubmit={handleSaveCategory} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCategory.name || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Slug</label>
                  <input
                    type="text"
                    value={editingCategory.slug || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Cover Image (Direct Upload)</label>
                  <div className="flex items-center gap-3">
                    {editingCategory.image_url && (
                      <img
                        src={editingCategory.image_url}
                        alt="Category Cover"
                        className="w-12 h-12 rounded-xl object-cover border border-stone-300 shrink-0"
                      />
                    )}
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-2 border border-stone-300 transition-colors">
                      {isUploadingCatImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#58101E]" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4 text-[#58101E]" />
                          <span>Upload Category Photo</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploadingCatImage}
                        onChange={(e) => {
                          handleCategoryPhoto(e.target.files);
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-4 py-2 border rounded-xl text-stone-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#58101E] text-white font-semibold rounded-xl"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ORDER INSPECT */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
              <div className="bg-[#58101E] text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#F7F1DC]">
                    Order #{selectedOrder.order_number}
                  </h3>
                  <p className="text-[11px] text-amber-200/80 font-mono">
                    Placed: {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-full text-amber-200 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
                {/* Status selector */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Payment Status</label>
                    <select
                      value={selectedOrder.payment_status}
                      onChange={(e) => handleUpdatePaymentStatus(selectedOrder.id, e.target.value as any)}
                      className="w-full bg-white border border-stone-300 rounded-xl p-2 font-semibold"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Failed">Failed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Dispatch / Order Status</label>
                    <select
                      value={selectedOrder.order_status}
                      onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value as any)}
                      className="w-full bg-white border border-stone-300 rounded-xl p-2 font-semibold"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Delivery Snapshot */}
                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 mb-2">
                    Customer Delivery Address Snapshot
                  </h4>
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                    <p className="font-bold text-stone-900">{selectedOrder.address_snapshot.full_name}</p>
                    <p className="text-stone-600">
                      {selectedOrder.address_snapshot.house_number}, {selectedOrder.address_snapshot.street}, {selectedOrder.address_snapshot.locality}
                    </p>
                    <p className="text-stone-600">
                      {selectedOrder.address_snapshot.city}, {selectedOrder.address_snapshot.state} - <strong>{selectedOrder.address_snapshot.pincode}</strong>
                    </p>
                    <p className="text-stone-700 font-mono pt-1">
                      📞 {selectedOrder.address_snapshot.phone} | ✉️ {selectedOrder.address_snapshot.email}
                    </p>
                  </div>
                </div>

                {/* Saree Items */}
                <div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 mb-2">
                    Ordered Sarees Snapshot
                  </h4>
                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="p-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product_image_snapshot}
                            alt=""
                            className="w-12 h-14 object-cover rounded-lg border border-stone-200"
                          />
                          <div>
                            <p className="font-serif font-bold text-stone-900">{item.product_name_snapshot}</p>
                            <p className="text-[11px] text-stone-500">Qty: {item.quantity} × ₹{item.unit_price.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#420B16]">
                          ₹{item.line_total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financials */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5 text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-stone-900">₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold text-stone-900">₹{selectedOrder.delivery_charge}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#420B16] pt-1 border-t border-stone-200">
                    <span>Total Amount:</span>
                    <span>₹{selectedOrder.total_amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
