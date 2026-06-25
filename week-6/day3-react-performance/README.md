# 🚀 Week-6 Day-3: React Performance & Patterns

## 📚 Topics Covered

* useMemo
* useCallback
* React.memo
* React.lazy
* Suspense
* useDebounce (Custom Hook)
* useLocalStorage (Custom Hook)
* useMediaQuery (Custom Hook)
* Error Boundaries
* Lighthouse Audit

---

# 📌 Project Objective

ఈ రోజు React application performance improve చేయడం, unnecessary re-renders avoid చేయడం, lazy loading implement చేయడం మరియు custom hooks create చేయడం నేర్చుకున్నాం.

---

# 📂 Project Structure

```text
src
│
├── App.jsx
├── main.jsx
│
├── pages
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   └── Performance.jsx
│
├── components
│   ├── ProductCard.jsx
│   ├── ErrorBoundary.jsx
│   └── CrashComponent.jsx
│
└── hooks
    ├── useDebounce.js
    ├── useLocalStorage.js
    └── useMediaQuery.js
```

---

# 1️⃣ useMemo

## Definition

`useMemo` is a React Hook used to **cache expensive calculations** so they are not executed on every render.

### Simple Example

Suppose we have **1000 products**.

When user changes only the **theme**, filtering should not happen again.

Without `useMemo`

```text
Theme Change
↓

Filtering Again ❌
```

With `useMemo`

```text
Theme Change
↓

Filtering NOT Again ✅
```

### Implemented In

```text
src/pages/Performance.jsx
```

```jsx
const filteredProducts = useMemo(() => {
   return products.filter(...);
}, [debouncedSearch]);
```

---

# 2️⃣ React.memo

## Definition

`React.memo` prevents a component from re-rendering if its props have not changed.

### Simple Example

Changing theme should not re-render every Product Card.

Without React.memo

```text
Theme Change

↓

1000 Product Cards Render Again ❌
```

With React.memo

```text
Theme Change

↓

No Re-render ✅
```

### Implemented In

```text
src/components/ProductCard.jsx
```

---

# 3️⃣ useCallback

## Definition

`useCallback` stores a function in memory so React does not recreate it on every render.

### Simple Example

```jsx
handleAddToCart()
```

Without useCallback

```text
New Function

↓

Every Render ❌
```

With useCallback

```text
Same Function

↓

Performance Improved ✅
```

### Implemented In

```text
src/pages/Performance.jsx
```

---

# 4️⃣ React.lazy

## Definition

`React.lazy` loads a component **only when it is needed**.

### Example

User opens Home page.

Home loads.

About page is NOT downloaded.

Only when user clicks About

↓

About page downloads.

### Implemented In

```text
App.jsx
```

```jsx
const Home = lazy(() => import("./pages/Home"));
```

---

# 5️⃣ Suspense

## Definition

`Suspense` displays a loading UI while a lazy-loaded component is downloading.

### Example

```text
Click About

↓

Loading...

↓

About Page
```

### Implemented In

```text
App.jsx
```

```jsx
<Suspense fallback={<h2>Loading...</h2>}>
```

---

# 6️⃣ useDebounce

## Definition

A custom hook that waits for the user to stop typing before performing an action.

### Real World Example

Google Search

Amazon Search

YouTube Search

### Our Project

Filtering happens only after **500ms**.

Instead of

```text
A

AB

ABC

ABCD
```

Filtering every key press ❌

It waits

↓

Filters once ✅

### Implemented In

```text
src/hooks/useDebounce.js

Used in:

src/pages/Performance.jsx
```

---

# 7️⃣ useLocalStorage

## Definition

A custom hook used to save data permanently in the browser.

### Real World Example

Dark Theme

Language

Shopping Cart

Remember Me

### Our Project

We saved

* Theme
* Search Text
* Cart Items

After refresh

↓

Still available ✅

### Implemented In

```text
src/hooks/useLocalStorage.js

Used in:

src/pages/Performance.jsx
```

---

# 8️⃣ useMediaQuery

## Definition

A custom hook used to detect screen size.

### Example

Desktop

↓

Show Navbar

Mobile

↓

Show Menu Button

### Implemented In

```text
src/hooks/useMediaQuery.js

Used in:

src/pages/Performance.jsx
```

---

# 9️⃣ Error Boundary

## Definition

Error Boundary catches React component errors and shows a fallback UI instead of crashing the entire application.

### Without Error Boundary

```text
Product Error

↓

Entire Website Crash ❌
```

### With Error Boundary

```text
Product Error

↓

Something Went Wrong

↓

Remaining App Works ✅
```

### Implemented In

```text
src/components/ErrorBoundary.jsx
```

---

# 🔟 Lighthouse Audit

## Definition

Lighthouse is a Chrome DevTools tool used to measure website quality.

It checks

* Performance
* Accessibility
* Best Practices
* SEO

### How to Open

```text
F12

↓

Lighthouse

↓

Analyze Page Load
```

### Target Score

```text
Performance      90+

Accessibility    90+

Best Practices   100

SEO              90+
```

---

# 💻 Features Implemented

✅ Product Search

✅ Theme Toggle

✅ Debounced Search

✅ Memoized Product Filtering

✅ React.memo Product Cards

✅ Add To Cart

✅ Shopping Cart

✅ Remove Item

✅ Clear Cart

✅ Theme Persistence

✅ Search Persistence

✅ Cart Persistence

✅ Mobile/Desktop Detection

✅ Lazy Loaded Pages

✅ Error Boundary Demo

---

# 🎯 Key Learnings

* Improved React application performance.
* Avoided unnecessary re-renders.
* Learned lazy loading for faster page loading.
* Created reusable custom hooks.
* Used Local Storage for persistent data.
* Detected device type using media queries.
* Implemented error handling using Error Boundaries.
* Measured application performance using Lighthouse.

---

# 🏁 Conclusion

In Day-3, we focused on **React Performance Optimization**. We learned how to optimize rendering using `useMemo`, `React.memo`, and `useCallback`, implemented custom hooks (`useDebounce`, `useLocalStorage`, `useMediaQuery`), added lazy loading with `React.lazy` and `Suspense`, handled UI errors with `ErrorBoundary`, and analyzed the application's quality using **Lighthouse Audit**.

These concepts are widely used in real-world React applications to build fast, optimized, and scalable user interfaces.
