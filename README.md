# 🛒 10X Shop — Full-Featured React E-Commerce Application

A modern, responsive, and feature-rich e-commerce web application built with React 19, TypeScript, Tailwind CSS v4, Formik, Yup, and React Router. Developed as a comprehensive single-page application (SPA) replicating a production-grade shopping experience.

---

## 🚀 Live Demo & Repository
- **GitHub Repository:** [Boka00/10X-Shop-Boris](https://github.com/Boka00/10X-Shop-Boris)
- **Live Deployment:** [https://10-x-shop-boris.vercel.app/](https://10-x-shop-boris.vercel.app/)

---

## 🛠️ Tech Stack & Architecture

- **Core Library:** React 19 (Functional Components, Custom Hooks, Lazy Loading)
- **Type Safety:** TypeScript (`"strict": true`)
- **Styling & UI:** Tailwind CSS v4 (Modern utility-first styling with responsive grid layouts & Dark Mode)
- **Routing:** React Router DOM v7 (Nested routing, Protected Routes, dynamic params)
- **Form Validation:** Formik & Yup (Robust client-side validation and error handling)
- **State Management:** React Context API (`AuthContext`, `CartContext` with `useReducer` and OOP domain models) combined with `localStorage` persistence

---

## ✨ Key Features

1. **Authentication & Protected Routes (`AuthContext`):**
   * Secure login simulation with DummyJSON API integration.
   * Persistent user session via `localStorage` with error handling.
   * Automatic redirection of unauthenticated users attempting to access protected routes (e.g., `/checkout`, `/orders`, `/profile`).

2. **Dynamic Product Catalog & Advanced Filtering:**
   * **Debounced Search (`useDebounce`):** 400ms delayed search input filtering across product titles, descriptions, and brands.
   * **Category Filtering & Multi-Criteria Sorting:** Dynamic category selection and sorting (Price, Rating, Name A-Z) synchronized with URL query parameters (`useSearchParams`).
   * **Client-Side Pagination:** Seamless page navigation with automatic reset to page 1 upon filter changes.

3. **Interactive Cart Management (`CartContext`):**
   * Add, remove, and update quantities with a stock-aware quantity stepper.
   * Real-time calculation of subtotal, discount savings, promo code (`10X10`), shipping fees, and item counts.
   * Persistent cart state across page reloads.

4. **Multi-Step Checkout & Order Confirmation:**
   * Formik-powered checkout form with strict Yup validation (Full Name, Email, Street Address, City, ZIP Code).
   * Generates a unique order confirmation receipt (`OrderSuccess`) and clears the cart upon successful submission.

5. **Orders & Profile Module (`/orders`, `/profile`):**
   * Per-user order history persistence with real-time status progression (`Processing` → `Shipped` → `Delivered`) and one-click `Reorder`.
   * Profile management with local data clearing and persistent Light/Dark mode.

---

## 📂 Project Structure

```text
10X-Shop-Boris/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/          # API integration (ApiClient, ApiError, products.api)
│   ├── components/   # UI components (cart, checkout, common, layout, product)
│   ├── context/      # React Context providers (AuthContext, CartContext)
│   ├── hooks/        # Custom hooks (useDebounce)
│   ├── models/       # OOP models (Cart, Order, StorageService)
│   ├── pages/        # Page components (Cart, Catalog, Checkout, Login, NotFound, Order, Product, Profile)
│   ├── routes/       # AppRoutes & ProtectedRoute authorization
│   ├── schemas/      # Yup validation schemas
│   ├── types/        # TypeScript interfaces & types (api, cart, order, product, user)
│   └── utils/        # Helper functions (price formatting, discounts)
├── DEBUG-LOG.md      # Technical bug fixes and issue resolution log
├── PLAN.md           # Project development roadmap and planning
├── REPORT.md         # Final technical report & metrics
├── COMPATIBILITY.md  # Cross-browser compatibility matrix
├── vercel.json       # SPA routing configuration for Vercel
├── package.json
└── README.md