# Debug & Issue Resolution Log

This document tracks key technical bugs, type mismatches, and architectural edge cases encountered and resolved during the development of **10X Shop**.

---

## Issue #1: Relative vs. Absolute Route Path in `CartItemRow`
* **Symptom:** Clicking a product's thumbnail in the cart navigated correctly to `/products/:id`, but clicking the product title navigated to `/cart/products/` (triggering the 404 NotFoundPage).
* **Root Cause:** The title `<Link>` component used a relative path (`to="products/"`) without a leading slash or dynamic `productId`, causing React Router v6 to append the path to the current `/cart` route.
* **Fix:** Updated the `<Link>` destination to an absolute dynamic path: ``to={`/products/${item.productId}`}``.

---

## Issue #2: TypeScript `IntrinsicAttributes` Error in `OrderSuccess`
* **Symptom:** Passing `orderId`, `customerName`, `email`, `shippingAddress`, and `totalPaid` to `<OrderSuccess />` caused a TypeScript compilation error: `Property 'orderId' does not exist on type 'IntrinsicAttributes'`.
* **Root Cause:** Although `OrderSuccessProps` interface was declared, the component function signature had an empty parameter list `()`, leaving props untyped.
* **Fix:** Destructured the props in the function signature and explicitly bound the `OrderSuccessProps` interface.

---

## Issue #3: Formik Silent Validation Block & Unresponsive Input on `CheckoutPage`
* **Symptom:** Typing in the Full Name input field did not update state, and clicking "Place Order" did not trigger `onSubmit` or transition to the `OrderSuccess` screen.
* **Root Cause:**
  1. Case mismatch between Formik's `initialValues.fullname` (lowercase `n`) and the input element's `id="fullName"` (uppercase `N`), preventing `handleChange` from matching the field.
  2. The submit button had `disabled={isValid}` instead of `disabled={!isValid || !dirty || isSubmitting}`, disabling the button whenever the form became valid.
* **Fix:** Aligned input `id`/`name`, `CheckoutFormValues` interface, and `checkoutSchema` keys to `fullname`, and inverted the button's `disabled` condition.

---

## Issue #4: Order Success Screen Prematurely Replaced by Empty Cart Guard
* **Symptom:** Calling `clearCart()` inside Formik's `onSubmit` handler risked rendering the "Your cart is empty" guard screen instead of the order confirmation screen.
* **Root Cause:** Clearing the cart sets `items.length` to `0`, triggering a re-render. If the `items.length === 0` guard is evaluated before checking `submittedOrder`, the component exits early with the empty cart view.
* **Fix:** Placed the `if (submittedOrder)` conditional return strictly above the `if (items.length === 0)` guard in `CheckoutPage.tsx`.

---

## Issue #5: Stale Pagination Page When Filtering or Searching Products
* **Symptom:** When viewing page 3 of the catalog and selecting a specific category or typing a search query with fewer results, the product grid appeared empty even though matching items existed on page 1.
* **Root Cause:** `currentPage` remained on page `3` while `filteredProducts` shrank to fit on a single page, causing `.slice()` to return an empty array.
* **Fix:** Created wrapper handlers (`handleSearchChange`, `handleCategoryChange`, `handleSortChange`, `handleResetFilters`) that synchronously reset `setCurrentPage(1)` whenever any filter criterion changes, avoiding cascading `useEffect` re-renders.