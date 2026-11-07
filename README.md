# 🛒 10X Shop — Full-Featured React E-Commerce Application

A modern, responsive, and feature-rich e-commerce web application built with **React 19, TypeScript, Tailwind CSS v4, Formik, Yup, and React Router v7**.

Developed as a comprehensive Single-Page Application (SPA), 10X Shop replicates a production-style online shopping experience, featuring authentication, product discovery, cart management, checkout, order history, and profile management.

---

## 🚀 Live Demo & Repository

- **Live Demo:** [10X Shop](https://10-x-shop-boris.vercel.app/)
- **GitHub Repository:** [Boka00 / 10X-Shop-Boris](https://github.com/Boka00/10X-Shop-Boris)

---

## 🛠️ Tech Stack & Architecture

| Technology | Purpose |
|---|---|
| **React 19** | Functional components, custom hooks, and lazy loading |
| **TypeScript** | Strict type checking (`"strict": true`) |
| **Tailwind CSS v4** | Responsive UI, utility-first styling, and dark mode |
| **React Router DOM v7** | Nested routing, protected routes, and dynamic route parameters |
| **Formik** | Form state management |
| **Yup** | Client-side form validation |
| **React Context API** | Global authentication and cart state management |
| **useReducer** | Predictable cart state updates |
| **localStorage** | Persistent user sessions, cart, orders, and preferences |
| **DummyJSON API** | Product data and authentication integration |

The application also uses an **Object-Oriented Programming (OOP)** approach through domain models such as `Cart`, `Order`, and `StorageService`.

---

## ✨ Key Features

### 1. Authentication & Protected Routes

- Login simulation integrated with the DummyJSON API.
- Persistent user sessions using `localStorage`.
- Centralized authentication state through `AuthContext`.
- Protected routes that automatically redirect unauthenticated users.
- Access control for private pages such as `/checkout`, `/orders`, and `/profile`.
- Error handling for authentication requests.

### 2. Dynamic Product Catalog & Advanced Filtering

- Dynamic product catalog powered by the DummyJSON API.
- Debounced search using a custom `useDebounce` hook.
- 400ms delayed search across product titles, descriptions, and brands.
- Dynamic category filtering.
- Multi-criteria sorting:
  - Price: Low to High / High to Low
  - Rating
  - Name: A–Z
- URL-synchronized filters and sorting using React Router's `useSearchParams`.
- Client-side pagination.
- Automatic pagination reset when filters change.

### 3. Interactive Cart Management

- Add and remove products from the shopping cart.
- Update product quantities with a stock-aware quantity stepper.
- Real-time cart calculations:
  - Subtotal
  - Discount savings
  - Shipping fees
  - Total price
  - Total item count
- Promo code support (`10X10`) for a 10% discount.
- Persistent cart state across page reloads.
- Centralized cart logic using `CartContext` and `useReducer`.

### 4. Checkout & Order Confirmation

- Formik-powered checkout form.
- Yup validation for:
  - Full Name
  - Email
  - Street Address
  - City
  - ZIP Code
- Form error handling and validation feedback.
- Unique order confirmation receipt through the `OrderSuccess` component.
- Automatic cart clearing after successful order submission.

### 5. Orders & Profile Management

- Individual order history for each user.
- Persistent order data using `localStorage`.
- Order status progression:
  - `Processing`
  - `Shipped`
  - `Delivered`
- One-click reorder functionality.
- Profile management.
- Persistent Light/Dark theme preference.
- Option to clear locally stored application data.

---

## 📂 Project Structure

```text
10X-Shop-Boris/
├── public/
│   └── favicon.svg
│
├── src/
│   ├── api/              # API integration (ApiClient, ApiError, products.api)
│   ├── components/       # Reusable UI components
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── common/
│   │   ├── layout/
│   │   └── product/
│   │
│   ├── context/          # AuthContext and CartContext
│   ├── hooks/            # Custom hooks (useDebounce)
│   ├── models/           # OOP models (Cart, Order, StorageService)
│   ├── pages/            # Application pages
│   ├── routes/           # AppRoutes and ProtectedRoute
│   ├── schemas/          # Yup validation schemas
│   ├── types/            # TypeScript interfaces and types
│   └── utils/            # Helper functions and utilities
│
├── DEBUG-LOG.md          # Technical bug fixes and issue resolution
├── PLAN.md               # Project development roadmap
├── REPORT.md             # Final technical report and metrics
├── COMPATIBILITY.md      # Cross-browser compatibility matrix
├── vercel.json           # SPA routing configuration for Vercel
├── package.json
└── README.md
```

---

## 💻 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/Boka00/10X-Shop-Boris.git
```

### 2. Navigate to the project directory

```bash
cd 10X-Shop-Boris
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at the local URL provided by Vite, usually:

```text
http://localhost:5173
```

---

## 📋 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Runs TypeScript build checks and creates the production bundle |
| `npm run preview` | Previews the production build locally |
| `npm run typecheck` | Runs the strict TypeScript compiler check |
| `npm run lint` | Runs ESLint across the project |

### Production Build

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

---

## 🔑 Test Credentials

Use the following credentials to test the authentication flow:

| Field | Value |
|---|---|
| Username | `emilys` |
| Password | `emilyspass` |
| Promo Code | `10X10` |

**Promo Code:** Applying `10X10` in the cart gives a 10% discount.

> Note: Authentication is implemented as a frontend application flow integrated with the DummyJSON API. Application data such as cart contents, orders, and preferences is persisted locally using `localStorage`.

---

## 📱 Responsive Design

The application is designed to provide a consistent shopping experience across different screen sizes:

- Desktop
- Tablet
- Mobile

The interface includes responsive product layouts, navigation, cart components, and checkout forms.

---

## 📚 Additional Documentation

The repository includes additional project documentation:

- **[PLAN.md](./PLAN.md)** — Project roadmap and development plan.
- **[DEBUG-LOG.md](./DEBUG-LOG.md)** — Technical issues, debugging process, and implemented fixes.
- **[REPORT.md](./REPORT.md)** — Final technical report and project metrics.
- **[COMPATIBILITY.md](./COMPATIBILITY.md)** — Cross-browser compatibility information.

---

## 👏 Credits

**Developed by Boris Mkrtichiani (Boka)**

Graduation Project — **10X College**

**Mentors:** Goga & Tsotne

**Product Data & Authentication API:** [DummyJSON](https://dummyjson.com/)

---

<p align="center">
  <strong>Built with React, TypeScript, and a passion for creating modern web experiences.</strong>
</p>
