# Browser & Device Compatibility Matrix (COMPATIBILITY.md)

ყველა გვერდი შემოწმდა Desktop (`1440×900`), Tablet (`768×1024`) და Mobile (`375×667` — iPhone SE) ეკრანებზე ჰორიზონტალური სქროლის, კლავიატურით ნავიგაციისა და ვიზუალური გამართულობის კუთხით.

| გვერდი / მარშრუტი | Chrome 130+ (Desktop / 375px) | Firefox 132+ (Desktop / 375px) | Edge / Safari (Desktop / 375px) | შედეგი და შენიშვნა |
| :--- | :---: | :---: | :---: | :--- |
| **Catalog (`/`)** | ✅ PASS | ✅ PASS | ✅ PASS | 4 სვეტი Desktop-ზე, 2-3 Tablet-ზე, 1 სვეტი 375px-ზე; ჰორიზონტალური scroll არ არის. |
| **Product (`/products/:id`)** | ✅ PASS | ✅ PASS | ✅ PASS | სურათების გალერეა, ტაბები, Reviews და Related Products სრულად ადაპტირდება. |
| **Cart (`/cart`)** | ✅ PASS | ✅ PASS | ✅ PASS | Promo კოდი `10X10`, რაოდენობის stepper და Order Summary გამართულია. |
| **Login (`/login`)** | ✅ PASS | ✅ PASS | ✅ PASS | Formik/Yup ვალიდაცია, კლავიატურით (`Tab`/`Enter`) სრული ნავიგაცია. |
| **Checkout (`/checkout`)** | ✅ PASS | ✅ PASS | ✅ PASS | 2-სვეტიანი განლაგება Desktop-ზე, 1-სვეტიანი Mobile-ზე; ზუსტი PRD მესიჯები. |
| **Orders (`/orders`, `/orders/:id`)** | ✅ PASS | ✅ PASS | ✅ PASS | Status Timeline და Reorder ფუნქციონალი მუშაობს შეუფერხებლად. |
| **Profile (`/profile`)** | ✅ PASS | ✅ PASS | ✅ PASS | პროფილის განახლება, Dark/Light თემის გადამრთველი და Clear local data. |