# Technical Debug Log (DEBUG-LOG.md)

ეს დოკუმენტი აღწერს პროექტის დეველოპმენტისა და რევიზიის დროს აღმოჩენილ 6 რეალურ ტექნიკურ ხარვეზს, მათ დიაგნოსტიკასა და გადაჭრის გზებს.

---

## Bug #1: Vercel SPA Direct Route 404 on Refresh (Routing / Deploy Bug)
- **სიმპტომი:** ლაივ დეპლოიზე (`vercel.app`) პირდაპირ `/products/5` ან `/cart` მისამართის გახსნისას ან გვერდის დარეფრეშებისას (`F5`) ბრაუზერი აბრუნებდა Vercel-ის სერვერულ `404: NOT_FOUND` შეცდომას.
- **რეპროდუქცია:** გახსენი ლაივ ბმული -> გადადი ნებისმიერ პროდუქტზე (`/products/1`) -> დააჭირე ბრაუზერის Refresh ღილაკს.
- **ინსტრუმენტი:** Chrome DevTools Network Tab (HTTP Status `404` document request-ზე).
- **მიზეზი (Root Cause):** Single Page Application-ში მარშრუტებს მართავს React Router კლიენტის მხარეს. Vercel-ის სერვერი კი ეძებდა ფიზიკურ ფაილს `/products/1/index.html`.
- **ფიქსი:** დაემატა `vercel.json` rewrite კონფიგურაცია (`"source": "/(.*)", "destination": "/index.html"`).
- **რა ვისწავლე:** SPA აპლიკაციების დეპლოისას აუცილებელია სერვერული fallback rewrite წესის გაწერა `index.html`-ზე.

---

## Bug #2: Checkout-ის ღილაკის ჯამისა და შენახული Order-ის აცდენა (Business Logic Bug)
- **სიმპტომი:** $40-იან კალათაზე `CheckoutPage`-ის ღილაკზე ეწერა `Place order ($40.00)` და `Shipping: Free`, ხოლო შეკვეთის დასრულებისას `OrderSuccess`-სა და `/orders` გვერდზე ჯამი ხდებოდა `$50.00`.
- **რეპროდუქცია:** დაამატე $100-ზე ნაკლები ღირებულების პროდუქტი კალათაში -> გადადი `/checkout`-ზე -> დააკვირდი ჯამს -> გააფორმე შეკვეთა.
- **ინსტრუმენტი:** React DevTools Components & Code Review (`CartContext.tsx` vs `models/Cart.ts`).
- **მიზეზი (Root Cause):** `CartContext` ითვლიდა მხოლოდ `subtotal`-ს მიწოდების გარეშე, ხოლო `OrderModel.create` იყენებდა `Cart` კლასს, რომელიც $100-მდე შეკვეთას $10 მიწოდების საფასურს უმატებდა.
- **ფიქსი:** `CartContext` გადავიდა `Cart` OOP კლასსა და `useReducer`-ზე, საიდანაც `subtotal`, `discount`, `shippingCost` და `total` ერთიანად მიეწოდება ყველა გვერდს.
- **რა ვისწავლე:** ფასებისა და ბიზნეს-წესების გამოთვლა უნდა არსებობდეს მხოლოდ ერთ ადგილას (Single Source of Truth).

---

## Bug #3: Profile-ის განახლების შემდეგ Checkout-ის Email-ის დაზიანება (Validation / State Bug)
- **სიმპტომი:** `/profile` გვერდზე სახელის და გვარის შენახვის შემდეგ `/checkout` გვერდზე გადასვლისას Email ველი ავტომატურად ივსებოდა არავალიდური მნიშვნელობით `First Last@example.com` (ჰარით).
- **რეპროდუქცია:** შედი სისტემაში -> `/profile`-ზე შეინახე First Name და Last Name -> გადადი `/checkout`-ზე.
- **ინსტრუმენტი:** React DevTools (Formik state inspection).
- **მიზეზი (Root Cause):** `updateProfile` ცვლიდა `user.username`-ს `"First Last"`-ით, ხოლო `CheckoutPage` უგულებელყოფდა `user.email`-ს და აგენერირებდა `${user.username}@example.com`-ს.
- **ფიქსი:** `AuthContext`-ში `username` დარჩა უცვლელ იდენტიფიკატორად, ხოლო `CheckoutPage` პირველ რიგში კითხულობს `user.email`-ს.
- **რა ვისწავლე:** მომხმარებლის უნიკალური ლოგინი (`username`) და საჩვენებელი სახელი (`firstName`, `lastName`) ცალ-ცალკე ველებად უნდა ინახებოდეს.

---

## Bug #4: Race Condition და ESLint `set-state-in-effect` შეცდომა `ProductPage`-სა და `CatalogPage`-ში (Async / Network Bug)
- **სიმპტომი:** პროდუქტებს შორის სწრაფი გადართვისას ან ფილტრის შეცვლისას ძველი ქსელური მოთხოვნა ასწრებდა ან აგვიანებდა დასრულებას, ხოლო `useEffect`-ში სინქრონული `setState` აგდებდა ESLint-ის შეცდომას.
- **რეპროდუქცია:** გაუშვი `npm run lint` ან სწრაფად გადადი `/products/1`-დან `/products/2`-ზე Slow 3G რეჟიმში.
- **ინსტრუმენტი:** Chrome DevTools Network (Slow 3G throttling) + ESLint (`react-hooks/set-state-in-effect`).
- **მიზეზი (Root Cause):** `fetch` მოთხოვნას არ ჰქონდა `AbortController`, ხოლო `!isValidId` მოწმდებოდა `useEffect`-ის შიგნით სინქრონული `setNotFound(true)`-ით.
- **ფიქსი:** ორივე გვერდზე დაემატა `AbortController` (`return () => controller.abort()`), ხოლო `isValidId` საწყის state-შივე მოწმდება.
- **რა ვისწავლე:** ყველა ასინქრონულ `useEffect`-ს სჭირდება გაუქმების მექანიზმი (`AbortController`), ხოლო წარმოებული მდგომარეობა render-ის დროს უნდა გამოითვალოს.

---

## Bug #5: `ProtectedRoute`-ის `location.state` Type Cast შეუსაბამობა (TypeScript Strict Bug)
- **სიმპტომი:** `ProtectedRoute` გადასცემდა `state={{ from: location }}` (მთლიან `Location` ობიექტს) ან სტრიქონს, ხოლო `LoginPage` იყენებდა უსაფრთხოების გარეშე cast-ს `location.state as { from?: string }`.
- **რეპროდუქცია:** კოდის ინსპექტირება და TypeScript-ის მკაცრი შემოწმება `LoginPage.tsx`-ში.
- **ინსტრუმენტი:** TypeScript Compiler (`tsc --noEmit`).
- **მიზეზი (Root Cause):** `location.state` არის `unknown` ტიპის და პირდაპირი `as` cast მალავდა სტრუქტურულ სხვაობას `Location` ობიექტსა და `string`-ს შორის.
- **ფიქსი:** დაიწერა სუფთა Type Guard ფუნქცია `getRedirectPath(state: unknown): string`, რომელიც უსაფრთხოდ ამოწმებს როგორც სტრიქონს, ისე `pathname` ველს.
- **რა ვისწავლე:** `unknown` მონაცემებთან (`location.state`, `JSON.parse`) ყოველთვის Type Guard უნდა გამოვიყენოთ და არა `as` cast.

---

## Bug #6: კატალოგის 12 პროდუქტით შეზღუდვა (API Pagination & Filtering Bug)
- **სიმპტომი:** კატალოგში ჩანდა მხოლოდ 12 პროდუქტი, პაგინაცია არ გამოდიოდა და კატეგორიების ფილტრი მხოლოდ 2-3 კატეგორიას აჩვენებდა.
- **რეპროდუქცია:** გახსენი მთავარი გვერდი `/` და სცადე მე-2 გვერდზე გადასვლა ან სხვა კატეგორიის არჩევა.
- **ინსტრუმენტი:** Chrome DevTools Network Tab (`GET /products?limit=12&skip=0`).
- **მიზეზი (Root Cause):** `fetchProducts` ნაგულისხმევად ითხოვდა `limit=12`-ს, ხოლო კლიენტის მხარეს ფილტრაცია და პაგინაცია ამ 12 პროდუქტზე მუშაობდა.
- **ფიქსი:** `fetchProducts`-ში `limit` შეიცვალა `0`-ით (რაც DummyJSON-ში აბრუნებს სრულ 194 პროდუქტს), რის შედეგადაც ყველა კატეგორია, ძებნა და 12-ელემენტიანი პაგინაცია სრულ კატალოგზე ამუშავდა.
- **რა ვისწავლე:** კლიენტის მხარეს კომბინირებული ფილტრაციისა და სორტირებისას აუცილებელია სრული მონაცემთა ნაკრების ქონა.