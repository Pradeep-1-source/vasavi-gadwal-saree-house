import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product, Category, Order, Address, Review, SiteSettings, OrderStatus, PaymentStatus } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_SETTINGS } from '../data/seedData';

// Local storage keys for fallback/offline persistence
const STORAGE_KEYS = {
  PRODUCTS: 'vgsh_products_data',
  CATEGORIES: 'vgsh_categories_data',
  ORDERS: 'vgsh_orders_data',
  ADDRESSES: 'vgsh_addresses_data',
  REVIEWS: 'vgsh_reviews_data',
  SETTINGS: 'vgsh_site_settings',
};

const isUuid = (id?: string | null): boolean => {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

// Initialize localStorage with seed data if not present
const getLocalData = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`Error reading localStorage for ${key}`, e);
    return fallback;
  }
};

const setLocalData = <T>(key: string, data: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error writing localStorage for ${key}`, e);
  }
};

export const api = {
  // PRODUCTS
  async getProducts(params?: {
    categorySlug?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'featured';
    featuredOnly?: boolean;
    includeInactive?: boolean;
  }): Promise<Product[]> {
    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            categories (id, name, slug),
            product_images (*)
          `);

        if (!params?.includeInactive) {
          query = query.eq('is_active', true);
        }

        if (params?.featuredOnly) {
          query = query.eq('is_featured', true);
        }

        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;

        if (data && data.length > 0) {
          let mapped: Product[] = data.map((item: any) => ({
            id: item.id,
            sku: item.sku,
            name: item.name,
            slug: item.slug,
            description: item.description || '',
            price: Number(item.price),
            compare_at_price: item.compare_at_price ? Number(item.compare_at_price) : undefined,
            category_id: item.category_id,
            category_name: item.categories?.name,
            fabric: item.fabric || 'Pure Gadwal Silk',
            colour: item.colour || 'Maroon',
            saree_length: item.saree_length || '6.2 Meters (including blouse)',
            blouse_details: item.blouse_details || 'Attached Contrast Blouse Piece (80 cm)',
            stock_quantity: item.stock_quantity ?? 5,
            is_featured: item.is_featured ?? false,
            is_active: item.is_active ?? true,
            images: (item.product_images || []).sort((a: any, b: any) => a.display_order - b.display_order),
            created_at: item.created_at,
          }));

          // Synchronize local cache with latest cloud products
          setLocalData(STORAGE_KEYS.PRODUCTS, mapped);

          if (params?.categorySlug) {
            mapped = mapped.filter(p => {
              const itemCat = data.find((d: any) => d.id === p.id)?.categories;
              return itemCat?.slug === params.categorySlug;
            });
          }

          if (params?.search) {
            const s = params.search.toLowerCase();
            mapped = mapped.filter(p => 
              p.name.toLowerCase().includes(s) || 
              p.description.toLowerCase().includes(s) || 
              p.colour.toLowerCase().includes(s) ||
              p.fabric.toLowerCase().includes(s)
            );
          }

          if (params?.minPrice !== undefined) {
            mapped = mapped.filter(p => p.price >= (params.minPrice || 0));
          }
          if (params?.maxPrice !== undefined) {
            mapped = mapped.filter(p => p.price <= (params.maxPrice || Infinity));
          }

          if (params?.sortBy === 'price-asc') mapped.sort((a, b) => a.price - b.price);
          else if (params?.sortBy === 'price-desc') mapped.sort((a, b) => b.price - a.price);
          else if (params?.sortBy === 'newest') mapped.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          else if (params?.sortBy === 'featured') mapped.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));

          return mapped;
        }
      } catch (err) {
        console.warn('Supabase products fetch error, using local dataset:', err);
      }
    }

    // Fallback to local storage
    let products = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);

    if (!params?.includeInactive) {
      products = products.filter(p => p.is_active);
    }
    if (params?.featuredOnly) {
      products = products.filter(p => p.is_featured);
    }
    if (params?.categorySlug) {
      const categories = getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
      const cat = categories.find(c => c.slug === params.categorySlug);
      if (cat) {
        products = products.filter(p => p.category_id === cat.id);
      }
    }
    if (params?.search) {
      const s = params.search.toLowerCase().trim();
      products = products.filter(p => 
        p.name.toLowerCase().includes(s) || 
        p.description.toLowerCase().includes(s) || 
        p.colour.toLowerCase().includes(s) ||
        p.fabric.toLowerCase().includes(s)
      );
    }
    if (params?.minPrice !== undefined) {
      products = products.filter(p => p.price >= (params.minPrice || 0));
    }
    if (params?.maxPrice !== undefined) {
      products = products.filter(p => p.price <= (params.maxPrice || Infinity));
    }

    if (params?.sortBy === 'price-asc') products.sort((a, b) => a.price - b.price);
    else if (params?.sortBy === 'price-desc') products.sort((a, b) => b.price - a.price);
    else if (params?.sortBy === 'newest') products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    else if (params?.sortBy === 'featured') products.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));

    return [...products];
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts({ includeInactive: true });
    return products.find(p => p.slug === slug) || null;
  },

  async getProductById(id: string): Promise<Product | null> {
    const products = await this.getProducts({ includeInactive: true });
    return products.find(p => p.id === id) || null;
  },

  async saveProduct(product: Partial<Product>): Promise<Product> {
    // 1. Resolve category UUID if needed
    let validCategoryId: string | null = null;
    const categories = await this.getCategories();
    if (product.category_id && isUuid(product.category_id)) {
      validCategoryId = product.category_id;
    } else if (product.category_id) {
      // Look up matching category by slug or id or name
      const found = categories.find(c => c.id === product.category_id || c.slug === product.category_id || c.name === product.category_name);
      if (found && isUuid(found.id)) {
        validCategoryId = found.id;
      } else if (categories.length > 0 && isUuid(categories[0].id)) {
        validCategoryId = categories[0].id;
      }
    } else if (categories.length > 0 && isUuid(categories[0].id)) {
      validCategoryId = categories[0].id;
    }

    const categoryObj = categories.find(c => c.id === validCategoryId);
    const categoryName = categoryObj?.name || product.category_name || 'Pure Gadwal Silk Sarees';

    const cleanSlug = (product.slug || (product.name || 'gadwal-saree').toLowerCase())
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const generatedSku = product.sku || `VGSH-${Math.floor(1000 + Math.random() * 9000)}`;

    const productPayload = {
      name: product.name || 'New Gadwal Saree',
      slug: cleanSlug,
      description: product.description || '',
      price: Number(product.price) || 9999,
      compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : null,
      category_id: validCategoryId,
      fabric: product.fabric || 'Pure Gadwal Silk',
      colour: product.colour || 'Maroon',
      saree_length: product.saree_length || '6.2 Meters (including blouse)',
      blouse_details: product.blouse_details || 'Attached Contrast Blouse Piece (80 cm)',
      stock_quantity: product.stock_quantity ?? 5,
      is_featured: product.is_featured ?? false,
      is_active: product.is_active ?? true,
      updated_at: new Date().toISOString()
    };

    let savedProduct: Product | null = null;

    if (isSupabaseConfigured) {
      try {
        if (product.id && isUuid(product.id)) {
          // Update existing product in Supabase
          const { data: updated, error: updateErr } = await supabase
            .from('products')
            .update(productPayload)
            .eq('id', product.id)
            .select('*, categories(*)')
            .single();

          if (updateErr) throw updateErr;

          // Re-sync product images
          if (product.images && product.images.length > 0) {
            await supabase.from('product_images').delete().eq('product_id', product.id);
            const imageInserts = product.images.map((img, idx) => ({
              product_id: product.id,
              image_url: img.image_url,
              alt_text: img.alt_text || product.name || 'Gadwal Saree',
              display_order: img.display_order ?? idx + 1,
            }));
            await supabase.from('product_images').insert(imageInserts);
          }

          savedProduct = {
            id: updated.id,
            sku: updated.sku,
            name: updated.name,
            slug: updated.slug,
            description: updated.description,
            price: Number(updated.price),
            compare_at_price: updated.compare_at_price ? Number(updated.compare_at_price) : undefined,
            category_id: updated.category_id,
            category_name: updated.categories?.name || categoryName,
            fabric: updated.fabric,
            colour: updated.colour,
            saree_length: updated.saree_length,
            blouse_details: updated.blouse_details,
            stock_quantity: updated.stock_quantity,
            is_featured: updated.is_featured,
            is_active: updated.is_active,
            images: product.images || [],
            created_at: updated.created_at,
          };
        } else {
          // Insert new product in Supabase
          const { data: inserted, error: insertErr } = await supabase
            .from('products')
            .insert({
              ...productPayload,
              sku: generatedSku,
              created_at: new Date().toISOString(),
            })
            .select('*, categories(*)')
            .single();

          if (insertErr) throw insertErr;

          let finalImages = product.images && product.images.length > 0 ? product.images : [
            {
              id: 'img-' + Date.now(),
              image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
              alt_text: product.name || 'Gadwal Saree',
              display_order: 1
            }
          ];

          const imageInserts = finalImages.map((img, idx) => ({
            product_id: inserted.id,
            image_url: img.image_url,
            alt_text: img.alt_text || product.name || 'Gadwal Saree',
            display_order: img.display_order ?? idx + 1,
          }));

          const { data: dbImages } = await supabase.from('product_images').insert(imageInserts).select();

          savedProduct = {
            id: inserted.id,
            sku: inserted.sku,
            name: inserted.name,
            slug: inserted.slug,
            description: inserted.description,
            price: Number(inserted.price),
            compare_at_price: inserted.compare_at_price ? Number(inserted.compare_at_price) : undefined,
            category_id: inserted.category_id,
            category_name: inserted.categories?.name || categoryName,
            fabric: inserted.fabric,
            colour: inserted.colour,
            saree_length: inserted.saree_length,
            blouse_details: inserted.blouse_details,
            stock_quantity: inserted.stock_quantity,
            is_featured: inserted.is_featured,
            is_active: inserted.is_active,
            images: dbImages && dbImages.length > 0 ? dbImages : finalImages,
            created_at: inserted.created_at,
          };
        }
      } catch (err) {
        console.error('Supabase save product error:', err);
      }
    }

    // Fallback/local storage cache update
    let products = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    if (!savedProduct) {
      if (product.id) {
        const index = products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          products[index] = { ...products[index], ...product, updated_at: new Date().toISOString() } as Product;
          setLocalData(STORAGE_KEYS.PRODUCTS, products);
          return products[index];
        }
      }

      savedProduct = {
        id: 'prod-' + Date.now(),
        sku: generatedSku,
        name: product.name || 'New Gadwal Saree',
        slug: cleanSlug,
        description: product.description || '',
        price: product.price || 9999,
        compare_at_price: product.compare_at_price,
        category_id: validCategoryId || 'cat-gadwal-silk',
        category_name: categoryName,
        fabric: product.fabric || 'Pure Gadwal Silk',
        colour: product.colour || 'Maroon',
        saree_length: product.saree_length || '6.2 Meters (including blouse)',
        blouse_details: product.blouse_details || 'Attached Contrast Blouse Piece (80 cm)',
        stock_quantity: product.stock_quantity ?? 5,
        is_featured: product.is_featured ?? false,
        is_active: product.is_active ?? true,
        images: product.images && product.images.length > 0 ? product.images : [
          {
            id: 'img-' + Date.now(),
            image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
            alt_text: product.name || 'Gadwal Saree',
            display_order: 1
          }
        ],
        created_at: new Date().toISOString()
      };
    }

    const existingIdx = products.findIndex(p => p.id === savedProduct!.id);
    if (existingIdx !== -1) {
      products[existingIdx] = savedProduct;
    } else {
      products.unshift(savedProduct);
    }
    setLocalData(STORAGE_KEYS.PRODUCTS, products);

    return savedProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('product_images').delete().eq('product_id', id);
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete product error:', err);
      }
    }
    let products = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    products = products.filter(p => p.id !== id);
    setLocalData(STORAGE_KEYS.PRODUCTS, products);
    return true;
  },

  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          const mapped: Category[] = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description || '',
            image_url: c.image_url || '',
            is_active: c.is_active ?? true,
            created_at: c.created_at,
          }));
          setLocalData(STORAGE_KEYS.CATEGORIES, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getCategories error, falling back to local storage:', err);
      }
    }
    return getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  async saveCategory(cat: Partial<Category>): Promise<Category> {
    const slug = (cat.name || 'category')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    let savedCat: Category | null = null;

    if (isSupabaseConfigured) {
      try {
        if (cat.id && isUuid(cat.id)) {
          const { data, error } = await supabase
            .from('categories')
            .update({
              name: cat.name,
              slug,
              description: cat.description || '',
              image_url: cat.image_url || '',
              is_active: cat.is_active ?? true,
            })
            .eq('id', cat.id)
            .select()
            .single();

          if (error) throw error;
          savedCat = {
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            image_url: data.image_url,
            is_active: data.is_active,
            created_at: data.created_at,
          };
        } else {
          const { data, error } = await supabase
            .from('categories')
            .insert({
              name: cat.name || 'New Category',
              slug,
              description: cat.description || '',
              image_url: cat.image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
              is_active: cat.is_active ?? true,
            })
            .select()
            .single();

          if (error) throw error;
          savedCat = {
            id: data.id,
            name: data.name,
            slug: data.slug,
            description: data.description,
            image_url: data.image_url,
            is_active: data.is_active,
            created_at: data.created_at,
          };
        }
      } catch (err) {
        console.warn('Supabase saveCategory error:', err);
      }
    }

    let categories = getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    if (!savedCat) {
      if (cat.id) {
        const idx = categories.findIndex(c => c.id === cat.id);
        if (idx !== -1) {
          categories[idx] = { ...categories[idx], ...cat } as Category;
          setLocalData(STORAGE_KEYS.CATEGORIES, categories);
          return categories[idx];
        }
      }
      savedCat = {
        id: 'cat-' + Date.now(),
        name: cat.name || 'New Category',
        slug,
        description: cat.description || '',
        image_url: cat.image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        is_active: true,
        created_at: new Date().toISOString()
      };
    }

    const cIdx = categories.findIndex(c => c.id === savedCat!.id);
    if (cIdx !== -1) {
      categories[cIdx] = savedCat;
    } else {
      categories.push(savedCat);
    }
    setLocalData(STORAGE_KEYS.CATEGORIES, categories);
    return savedCat;
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('categories').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete category error:', err);
      }
    }
    let categories = getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    categories = categories.filter(c => c.id !== id);
    setLocalData(STORAGE_KEYS.CATEGORIES, categories);
    return true;
  },

  // ORDERS
  async createOrder(orderPayload: {
    userId: string;
    userEmail?: string;
    userName?: string;
    address: Address;
    items: { product: Product; quantity: number }[];
    subtotal: number;
    deliveryCharge: number;
    discountAmount: number;
    totalAmount: number;
    paymentProvider: 'whatsapp' | 'phonepe_upi' | 'razorpay' | 'cash_on_delivery' | 'test_mode' | string;
    paymentStatus: PaymentStatus;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
  }): Promise<Order> {
    const orders = getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `VGSH-${dateStr}-${randomNum}`;

    const formattedItems = orderPayload.items.map(i => ({
      id: 'item-' + Math.random().toString(36).substring(2, 9),
      product_id: i.product.id,
      product_name_snapshot: i.product.name,
      product_image_snapshot: i.product.images[0]?.image_url || '',
      unit_price: i.product.price,
      quantity: i.quantity,
      line_total: i.product.price * i.quantity,
    }));

    let newOrder: Order = {
      id: 'ord-' + Date.now(),
      order_number: orderNumber,
      user_id: orderPayload.userId,
      user_email: orderPayload.userEmail || orderPayload.address.email,
      user_name: orderPayload.userName || orderPayload.address.full_name,
      address_snapshot: { ...orderPayload.address },
      subtotal: orderPayload.subtotal,
      delivery_charge: orderPayload.deliveryCharge,
      discount_amount: orderPayload.discountAmount,
      total_amount: orderPayload.totalAmount,
      payment_provider: orderPayload.paymentProvider,
      payment_status: orderPayload.paymentStatus,
      order_status: orderPayload.paymentStatus === 'Paid' ? 'Confirmed' : 'Pending',
      razorpay_order_id: orderPayload.razorpayOrderId,
      razorpay_payment_id: orderPayload.razorpayPaymentId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: formattedItems,
    };

    if (isSupabaseConfigured) {
      try {
        const { data: dbOrder, error: ordErr } = await supabase.from('orders').insert({
          order_number: orderNumber,
          user_id: isUuid(orderPayload.userId) ? orderPayload.userId : null,
          customer_name: orderPayload.userName || orderPayload.address.full_name,
          customer_phone: orderPayload.address.phone,
          customer_email: orderPayload.userEmail || orderPayload.address.email,
          address_snapshot: {
            ...orderPayload.address,
            order_items: formattedItems
          },
          subtotal: orderPayload.subtotal,
          delivery_charge: orderPayload.deliveryCharge,
          discount_amount: orderPayload.discountAmount,
          total_amount: orderPayload.totalAmount,
          payment_method: orderPayload.paymentProvider,
          payment_provider: orderPayload.paymentProvider,
          payment_status: orderPayload.paymentStatus,
          order_status: orderPayload.paymentStatus === 'Paid' ? 'Confirmed' : 'Pending',
        }).select().single();

        if (!ordErr && dbOrder) {
          newOrder.id = dbOrder.id;
        }
      } catch (err) {
        console.warn('Supabase createOrder error, local order saved:', err);
      }
    }

    orders.unshift(newOrder);
    setLocalData(STORAGE_KEYS.ORDERS, orders);

    // Deduct stock quantity
    let products = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    orderPayload.items.forEach(orderItem => {
      const pIdx = products.findIndex(p => p.id === orderItem.product.id);
      if (pIdx !== -1) {
        products[pIdx].stock_quantity = Math.max(0, products[pIdx].stock_quantity - orderItem.quantity);
      }
    });
    setLocalData(STORAGE_KEYS.PRODUCTS, products);

    return newOrder;
  },

  async getOrderById(orderIdOrNumber: string): Promise<Order | null> {
    const orders = await this.getAllOrders();
    return orders.find(o => o.id === orderIdOrNumber || o.order_number.toLowerCase() === orderIdOrNumber.toLowerCase()) || null;
  },

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const orders = await this.getAllOrders();
    return orders.filter(o => o.user_id === userId);
  },

  async getAllOrders(): Promise<Order[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) {
          const mapped: Order[] = data.map((o: any) => ({
            id: o.id,
            order_number: o.order_number,
            user_id: o.user_id || 'guest',
            user_email: o.customer_email || o.address_snapshot?.email,
            user_name: o.customer_name || o.address_snapshot?.full_name,
            address_snapshot: o.address_snapshot,
            subtotal: Number(o.subtotal),
            delivery_charge: Number(o.delivery_charge),
            discount_amount: Number(o.discount_amount),
            total_amount: Number(o.total_amount),
            payment_provider: o.payment_provider || o.payment_method || 'whatsapp',
            payment_status: o.payment_status as PaymentStatus,
            order_status: o.order_status as OrderStatus,
            created_at: o.created_at,
            updated_at: o.updated_at,
            items: (o.address_snapshot?.order_items || []).map((it: any, idx: number) => ({
              id: it.id || `item-${idx}`,
              product_id: it.product_id,
              product_name_snapshot: it.product_name_snapshot || it.product_name || 'Gadwal Saree',
              product_image_snapshot: it.product_image_snapshot || it.product_image || '',
              unit_price: Number(it.unit_price || 0),
              quantity: Number(it.quantity || 1),
              line_total: Number(it.line_total || it.unit_price || 0),
            })),
          }));
          setLocalData(STORAGE_KEYS.ORDERS, mapped);
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getAllOrders error, fallback to local storage:', err);
      }
    }
    return getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    if (isSupabaseConfigured && isUuid(orderId)) {
      try {
        await supabase
          .from('orders')
          .update({ order_status: status, updated_at: new Date().toISOString() })
          .eq('id', orderId);
      } catch (err) {
        console.warn('Supabase updateOrderStatus error:', err);
      }
    }
    const orders = getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].order_status = status;
      orders[idx].updated_at = new Date().toISOString();
      setLocalData(STORAGE_KEYS.ORDERS, orders);
      return orders[idx];
    }
    return null;
  },

  async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus, paymentDetails?: { razorpayPaymentId?: string }): Promise<Order | null> {
    if (isSupabaseConfigured && isUuid(orderId)) {
      try {
        await supabase
          .from('orders')
          .update({
            payment_status: paymentStatus,
            order_status: paymentStatus === 'Paid' ? 'Confirmed' : 'Pending',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);
      } catch (err) {
        console.warn('Supabase updatePaymentStatus error:', err);
      }
    }
    const orders = getLocalData<Order[]>(STORAGE_KEYS.ORDERS, []);
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].payment_status = paymentStatus;
      if (paymentStatus === 'Paid') {
        orders[idx].order_status = 'Confirmed';
      }
      if (paymentDetails?.razorpayPaymentId) {
        orders[idx].razorpay_payment_id = paymentDetails.razorpayPaymentId;
      }
      orders[idx].updated_at = new Date().toISOString();
      setLocalData(STORAGE_KEYS.ORDERS, orders);
      return orders[idx];
    }
    return null;
  },

  // ADDRESSES
  async getAddresses(userId: string): Promise<Address[]> {
    const all = getLocalData<Address[]>(STORAGE_KEYS.ADDRESSES, []);
    return all.filter(a => a.user_id === userId);
  },

  async saveAddress(address: Partial<Address> & { user_id: string }): Promise<Address> {
    const addresses = getLocalData<Address[]>(STORAGE_KEYS.ADDRESSES, []);
    if (address.id) {
      const idx = addresses.findIndex(a => a.id === address.id);
      if (idx !== -1) {
        addresses[idx] = { ...addresses[idx], ...address } as Address;
        setLocalData(STORAGE_KEYS.ADDRESSES, addresses);
        return addresses[idx];
      }
    }
    const newAddress: Address = {
      id: 'addr-' + Date.now(),
      user_id: address.user_id,
      full_name: address.full_name || '',
      phone: address.phone || '',
      email: address.email || '',
      house_number: address.house_number || '',
      building_name: address.building_name || '',
      street: address.street || '',
      locality: address.locality || '',
      landmark: address.landmark || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      country: address.country || 'India',
      is_default: address.is_default || addresses.length === 0,
      created_at: new Date().toISOString()
    };
    if (newAddress.is_default) {
      addresses.forEach(a => { if (a.user_id === address.user_id) a.is_default = false; });
    }
    addresses.push(newAddress);
    setLocalData(STORAGE_KEYS.ADDRESSES, addresses);
    return newAddress;
  },

  async deleteAddress(id: string): Promise<boolean> {
    let addresses = getLocalData<Address[]>(STORAGE_KEYS.ADDRESSES, []);
    addresses = addresses.filter(a => a.id !== id);
    setLocalData(STORAGE_KEYS.ADDRESSES, addresses);
    return true;
  },

  // REVIEWS
  async getReviews(productId?: string): Promise<Review[]> {
    const reviews = getLocalData<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    if (productId) {
      return reviews.filter(r => r.product_id === productId && r.is_approved);
    }
    return reviews;
  },

  async submitReview(review: Omit<Review, 'id' | 'created_at' | 'is_approved'>): Promise<Review> {
    const reviews = getLocalData<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const newReview: Review = {
      ...review,
      id: 'rev-' + Date.now(),
      is_approved: true, // Auto-approve for seamless experience, configurable in admin
      created_at: new Date().toISOString(),
    };
    reviews.unshift(newReview);
    setLocalData(STORAGE_KEYS.REVIEWS, reviews);
    return newReview;
  },

  async updateReviewStatus(id: string, isApproved: boolean): Promise<boolean> {
    const reviews = getLocalData<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const item = reviews.find(r => r.id === id);
    if (item) {
      item.is_approved = isApproved;
      setLocalData(STORAGE_KEYS.REVIEWS, reviews);
      return true;
    }
    return false;
  },

  // SETTINGS
  async getSettings(): Promise<SiteSettings> {
    return getLocalData<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = getLocalData<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    const updated = { ...current, ...settings };
    setLocalData(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }
};
