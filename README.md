# 🛒 10X Shop — Full-Featured React E-Commerce Application

A modern, responsive, and feature-rich e-commerce web application built with React, TypeScript, Tailwind CSS, Formik, Yup, and React Router. Developed as a comprehensive single-page application (SPA) replicating a production-grade shopping experience.

---

## 🚀 Live Demo & Repository
* **GitHub Repository:** [Boka00/10X-Shop](https://github.com/Boka00)
* **Live Deployment:** [https://10-x-shop-boris.vercel.app/](https://10-x-shop-boris.vercel.app/)

---

## 🛠️ Tech Stack & Architecture

* **Core Library:** React 18+ (Functional Components, Custom Hooks)
* **Type Safety:** TypeScript
* **Styling & UI:** Tailwind CSS (Modern utility-first styling with responsive grid layouts)
* **Routing:** React Router DOM (Nested routing, Protected Routes, dynamic params)
* **Form Validation:** Formik & Yup (Robust client-side validation and error handling)
* **State Management:** React Context API (`AuthContext`, `CartContext`) combined with `localStorage` persistence

---

## ✨ Key Features

1. **Authentication & Protected Routes (`AuthContext`):**
   * Secure login simulation with DummyJSON API integration.
   * Persistent user session via `localStorage`.
   * Automatic redirection of unauthenticated users attempting to access protected routes (e.g., `/checkout`).

2. **Dynamic Product Catalog & Advanced Filtering:**
   * **Debounced Search (`useDebounce`):** 300ms delayed search input filtering across product titles and descriptions without lag.
   * **Category Filtering:** Dynamic category extraction and filtering.
   * **Multi-Criteria Sorting:** Sort by price (Low to High, High to Low) and customer ratings.
   * **Client-Side Pagination:** Seamless page navigation (`Previous`, page numbers, `Next`) with automatic reset to page 1 upon filter changes.

3. **Interactive Cart Management (`CartContext`):**
   * Add, remove, and update quantities with a stock-aware quantity stepper.
   * Real-time calculation of subtotal, discount savings, and item counts.
   * Persistent cart state across page reloads.

4. **Multi-Step Checkout & Order Confirmation:**
   * Formik-powered checkout form with strict Yup validation (Full Name, Email, Street Address, City, ZIP Code).
   * Generates a unique order confirmation receipt (`OrderSuccess`) and clears the cart upon successful submission.

---

## 📂 Project Structure

```text
10-X-Shop/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/          # API integration (DummyJSON products & auth)
│   ├── assets/       # Static images & graphics
│   ├── components/
│   │   ├── cart/     # Cart item rows & cart UI components
│   │   ├── checkout/ # Order success confirmation card
│   │   ├── common/   # Reusable components (Pagination, etc.)
│   │   ├── layout/   # Container, Header, Footer, Layout, ScrollToTop
│   │   └── product/  # ProductCard, ProductFilters, ProductGrid
│   ├── context/      # React Context providers (AuthContext, CartContext)
│   ├── hooks/        # Custom hooks (useDebounce)
│   ├── pages/        # Page components (Cart, Catalog, Checkout, Login, NotFound, ProductDetails)
│   ├── routes/       # AppRoutes & ProtectedRoute authorization
│   ├── schemas/      # Yup validation schemas
│   ├── types/        # TypeScript interfaces & types (cart, order, product, user)
│   ├── utils/        # Helper functions (price formatting, discounts)
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── DEBUG-LOG.md      # Technical bug fixes and issue resolution log
├── PLAN.md           # Project development roadmap and planning
├── vercel.json       # SPA routing configuration for Vercel
├── package.json
└── README.md