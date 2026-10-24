# 10X Shop — Project Plan (PLAN.md)

## 1. მიზანი და Scope
პროექტის მიზანია ონლაინ მაღაზიის SPA აპლიკაციის („10X Shop“) შექმნა React 19, TypeScript (strict) და Tailwind CSS v4-ის გამოყენებით, DummyJSON API-ზე დაყრდნობით.

- **React:** CORE (Components, Router, Context, Controlled Checkout) + FULL (Login ფორმა Formik + Yup-ით).
- **TypeScript:** CORE (Strict mode, Props/State/API მოდელები, 0 typecheck error).
- **Tailwind CSS:** CORE (v4 ინტეგრაცია, utility-first, responsive grid/flex, interactive states).
- **Optimization:** CORE (Responsive 375px+, Error Boundary, DEBUG-LOG.md).

## 2. Work Breakdown Structure (WBS)
| Epic | ამოცანა | შეფასება | კვირა | Definition of Done (DoD) |
|---|---|---|---|---|
| **Setup & Docs** | Vite + TS + Tailwind v4, PLAN.md, Types | 4 სთ | კვირა 1 | `npm run typecheck` და `build` უშეცდომოა |
| **Layout & Routes** | Header, Footer, Outlet, 404 გვერდი | 4 სთ | კვირა 1 | ყველა მარშრუტი მუშაობს reload-ის გარეშე |
| **Auth (CORE+FULL)**| AuthContext, ProtectedRoute, Formik+Yup Login | 6 სთ | კვირა 1 | Yup ბლოკავს არავალიდურ ფორმას; იცვლება Context |
| **Catalog** | DummyJSON API, ProductCard, Responsive Grid | 6 სთ | კვირა 1 | პროდუქტები იტვირთება; ჩანს Loading/Error/Empty |
| **Product Details** | `/products/:id`, გალერეა, რაოდენობის არჩევა | 5 სთ | კვირა 2 | არასწორ ID-ზე ჩანს 404; ემატება კალათაში |
| **Cart** | CartContext, localStorage, CartPage | 6 სთ | კვირა 2 | რაოდენობის შეცვლა/წაშლა ანახლებს ჯამს და ბეჯს |
| **Checkout** | Controlled Checkout ფორმა, Order summary | 5 სთ | კვირა 2 | ვალიდური submit აჩვენებს დადასტურებას და ცლის კალათას |
| **Quality & Deploy**| Error Boundary, 375px ტესტი, Vercel, README | 6 სთ | კვირა 3 | ლაივ ბმული მუშაობს, დოკუმენტაცია სრულია |

## 3. რისკები და შემარბილებელი ზომები (Mitigation)
1. **DummyJSON API-ის მიუწვდომლობა ან შეფერხება:** UI-ში გათვალისწინებულია Error მდგომარეობა და მომხმარებლისთვის გასაგები შეტყობინება აპლიკაციის დაქრაშვის გარეშე.
2. **TypeScript-ის მკაცრი ტიპიზაციის შეცდომები Build-ის დროს:** ყოველი ფუნქციონალის დასრულებისას ეშვება `npm run typecheck`.
3. **SPA Routing-ის 404 შეცდომა Vercel-ზე რეფრეშისას:** დაემატება `vercel.json` rewrite კონფიგურაცია.