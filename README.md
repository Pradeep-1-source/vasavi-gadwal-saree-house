# Vasavi Gadwal Saree House — Premium E-Commerce Platform

A production-ready Indian ethnic handloom e-commerce website built for **Vasavi Gadwal Saree House**, showcasing authentic pure mulberry silk and fine cotton Gadwal sarees handcrafted with traditional interlocking **Kuttu zari borders**.

---

## 1. Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom Indian heritage palette (`maroon`, `gold`, `cream`)
- **Backend & Database**: Supabase (PostgreSQL with Row Level Security, Supabase Auth, Storage)
- **Payments**: Razorpay Payment Gateway integration (INR, UPI, Cards, NetBanking) with Vercel serverless validation
- **Serverless**: Vercel Functions (`/api/create-razorpay-order.ts`, `/api/verify-payment.ts`)
- **Icons**: Lucide React
- **Animations**: Canvas Confetti

---

## 2. Brand Identity & Features

### Brand Identity
- **Name**: Vasavi Gadwal Saree House
- **Palette**: Royal Maroon (`#58101E`, `#801A2D`), Antique Gold (`#C5A059`, `#D4AF37`), Ivory/Cream (`#FDFBF7`, `#FFFDF9`)
- **Typography**: Cormorant Garamond & Cinzel for regal serif headings; Plus Jakarta Sans for clean body text
- **Customer Helpline**: `+91 7660833168`
- **WhatsApp Concierge**: `https://wa.me/917660833168` (Floating button on every page, pre-filled saree inquiry URLs)

### Key Customer Workflows
1. **Storefront & Homepage**:
   - Announcement bar highlighting flat ₹100 express delivery across India.
   - Hero banner: *"Timeless Elegance. Traditional Gadwal Weaves."*
   - Curated collections grid (Gadwal Silk, Traditional Silk, Wedding, Festive, Cotton, New Arrivals, Bestsellers).
   - Heritage story section explaining the sacred Kuttu interlocking technique.
   - Customer testimonials with verified buyer badges.
   - Dedicated WhatsApp concierge section with phone `7660833168`.
   - Newsletter signup with explicit user consent.
2. **Product Catalogue & Detailed Drape View**:
   - Filter by weave category, price range, fabric purity, and stock availability.
   - Detailed product view with multi-image gallery and **interactive hover zoom**.
   - Specifications: Fabric, Colour, Saree Length (6.2m including blouse), Blouse details, SKU code.
   - Direct WhatsApp enquiry button sending saree title & SKU to `7660833168`.
   - Customer review submission with star ratings.
3. **Cart & Delivery Checkout**:
   - Persistent shopping cart drawer and full cart view.
   - Transparent **flat ₹100 express delivery charge** across India (waived automatically if subtotal reaches threshold).
   - Strict Indian address validation (10-digit mobile number, 6-digit Indian PIN code, state selection).
   - Mandatory customer login for checkout to ensure reliable order tracking.
4. **Razorpay Payments**:
   - Secure server-side pricing validation and signature verification.
   - Built-in developer test simulator mode for zero-credential testing.
   - Order confirmation with celebratory confetti and real-time status tracker (Pending → Confirmed → Processing → Shipped → Delivered).
5. **Customer Account Portal**:
   - Authentication via Supabase Auth (Sign In, Register, Forgot Password).
   - Customer Profile editor (Name, Phone).
   - Saved Addresses manager (add, edit, delete, default).
   - Order History with historical item snapshots.
   - Wishlist.
6. **Administrator Control Panel**:
   - Overview metrics: Verified sales (Paid only), Total orders, Active products, Low-stock warnings.
   - Complete product management (Add, edit, delete, stock modifier, multiple images).
   - Order management (Inspect customer address snapshots, change payment status, update order statuses).
   - Category management (Add & edit categories).
   - Customer review moderation.
   - Store settings (Delivery charge, free delivery threshold, announcement bar text).

---

## 3. Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd "saree house"

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application runs immediately at `http://localhost:5173`.
*Note: Even without Supabase or Razorpay credentials configured, the application operates in an intelligent offline/demo mode with persistent local storage, allowing complete end-to-end testing of customer flows and admin dashboard.*

---

## 4. Supabase Database Setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase Dashboard.
3. Open `supabase/migrations/20250101000000_init_schema.sql` and run the entire SQL script.
4. The migration will create:
   - 11 relational tables (`profiles`, `addresses`, `categories`, `products`, `product_images`, `carts`, `cart_items`, `orders`, `order_items`, `payments`, `reviews`, `site_settings`).
   - Comprehensive Row Level Security (RLS) policies.
   - Database trigger on `auth.users` to automatically populate customer profiles on registration.
   - Seed data for site settings.

### Supabase Storage Setup (Product Images)
1. In the Supabase Dashboard, go to **Storage** → **New Bucket**.
2. Name the bucket `product-images` and mark it as **Public**.
3. Under **Policies**, ensure `SELECT` is allowed for public, and `INSERT/UPDATE/DELETE` is restricted to authenticated admin users.

---

## 5. Environment Variables Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Fill in your project credentials:
```ini
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Razorpay
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

> **Security Notice**: Never expose `RAZORPAY_KEY_SECRET` or `SUPABASE_SERVICE_ROLE_KEY` to frontend code with `VITE_` prefixes. These are accessed exclusively inside serverless functions.

---

## 6. Vercel Deployment

This project is fully structured for zero-configuration Vercel deployment:
1. Push this repository to GitHub or GitLab.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import the repository.
4. Set the Framework Preset to **Vite**.
5. Add the Environment Variables from your `.env` file under **Project Settings → Environment Variables**.
6. Click **Deploy**.

Vercel will build the frontend and deploy the serverless functions in `/api` automatically.

---

## 7. Customer Helpline & WhatsApp
- **Customer Helpline**: `+91 7660833168`
- **Official WhatsApp Support**: [https://wa.me/917660833168](https://wa.me/917660833168)
- **Origin**: Jogulamba Gadwal, Telangana, India
