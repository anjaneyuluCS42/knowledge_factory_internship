# Week-6 Day-2: TanStack Query (React Query) Deep Dive

## 📌 Overview

On Day-2, I learned how modern React applications manage server data using **TanStack Query (React Query)**. Instead of manually handling API calls using `useEffect` and `useState`, React Query provides built-in caching, refetching, loading states, error handling, and server-state management.

---

## 🎯 Objectives

* Understand TanStack Query fundamentals
* Learn `useQuery()` for data fetching
* Learn `useMutation()` for data modification
* Understand caching and query keys
* Implement refetching and query invalidation
* Learn optimistic updates
* Explore infinite scrolling concepts
* Learn prefetching techniques
* Replace traditional `useEffect + useState` API handling

---

## 📂 Project Structure

```text
day2-react-query/
│
├── src/
│   ├── api/
│   │   └── productsApi.js
│   │
│   ├── components/
│   │   └── Products.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js
```

---

## 🚀 Installation

```bash
npm install
npm install axios
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools
```

Run Project:

```bash
npm run dev
```

---

# 📚 Concepts Covered

## 1. TanStack Query Introduction

### Why React Query?

Traditional React API handling:

```jsx
useState()
useEffect()
axios()
```

Problems:

* Manual loading state
* Manual error state
* No caching
* Repeated API calls
* More boilerplate code

React Query solves:

* Caching
* Refetching
* Error handling
* Loading states
* Background updates

---

## 2. useQuery()

Used for fetching server data.

Example:

```jsx
const {
  data,
  isLoading,
  error,
} = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
});
```

### Real World Usage

* Amazon Product Listing
* Swiggy Restaurant List
* Netflix Movie List

---

## 3. Query Keys

Query keys uniquely identify cached data.

Examples:

```jsx
["products"]

["product", id]

["cart"]

["orders"]
```

### Benefits

* Better cache management
* Easy query invalidation
* Organized server state

---

## 4. Caching

React Query stores fetched data in memory.

Example:

```text
First Visit
↓
API Call

Second Visit
↓
Cache
```

### Real World Example

Amazon product pages load faster because cached data is reused.

---

## 5. staleTime

Defines how long data remains fresh.

Example:

```jsx
staleTime: 10000
```

Meaning:

```text
10 seconds fresh
```

After that:

```text
Data becomes stale
```

---

## 6. Refetching

Manually refresh data.

Example:

```jsx
refetch()
```

```jsx
<button onClick={() => refetch()}>
  Refresh Products
</button>
```

---

## 7. React Query DevTools

Used to inspect:

* Cache
* Query status
* Refetching
* Fresh/Stale state

Installation:

```bash
npm install @tanstack/react-query-devtools
```

---

## 8. useMutation()

Used for:

* POST
* PUT
* PATCH
* DELETE

Example:

```jsx
const mutation = useMutation({
  mutationFn: addProduct,
});
```

### Real World Usage

* Add To Cart
* Place Order
* Add Review
* Update Profile

---

## 9. onSuccess()

Runs when mutation succeeds.

```jsx
onSuccess: () => {
  alert("Success");
}
```

---

## 10. onError()

Runs when mutation fails.

```jsx
onError: () => {
  alert("Something went wrong");
}
```

---

## 11. Query Invalidation

Used to refresh stale data.

```jsx
queryClient.invalidateQueries({
  queryKey: ["products"],
});
```

Flow:

```text
Mutation Success
↓
Invalidate Query
↓
Refetch Query
↓
Update UI
```

---

## 12. Optimistic Updates

Update UI before server response arrives.

Example:

```text
Instagram Like Button

100 Likes
↓
101 Likes
```

Immediately updates UI.

---

## 13. Loading State

```jsx
if (isLoading) {
  return <h2>Loading Products...</h2>;
}
```

---

## 14. Error State

```jsx
if (error) {
  return <h2>Something Went Wrong</h2>;
}
```

---

## 15. Empty State

```jsx
if (data.length === 0) {
  return <h2>No Products Found</h2>;
}
```

---

## 16. useInfiniteQuery()

Used for infinite scrolling.

Examples:

* Instagram Feed
* Amazon Product Lists
* Swiggy Restaurants

Concept:

```text
Scroll
↓
Load More Data
```

---

## 17. Prefetching

Loads data before the user requests it.

Example:

```text
Hover Product
↓
Prefetch Details
↓
Store In Cache
```

Used in:

* Amazon Product Details
* Netflix Movie Preview
* Swiggy Menu Preview

---

## 18. Replacing useEffect + useState

Old Approach:

```jsx
useState()
useEffect()
axios()
```

New Approach:

```jsx
useQuery()
```

Benefits:

* Less code
* Better performance
* Automatic caching
* Easier maintenance

---

# 🛒 What We Built

A Product Listing Application with:

* Product Fetching
* Product Images
* Product Ratings
* Product Categories
* Refresh Button
* Add Product Mutation
* Query Invalidation
* React Query DevTools

---

# 🏢 Real World Applications

## Amazon

* Product Listing → useQuery
* Product Details → useQuery
* Add To Cart → useMutation
* Reviews → invalidateQueries
* Infinite Product Lists → useInfiniteQuery

## Swiggy

* Restaurant List → useQuery
* Menu Items → useQuery
* Cart Updates → useMutation
* Order Updates → invalidateQueries

---

# 🎤 Interview Questions

### What is TanStack Query?

A server-state management library for React applications.

### What is useQuery?

Used for fetching and caching server data.

### What is useMutation?

Used for creating, updating, and deleting data.

### What is queryKey?

A unique identifier for cached queries.

### What is staleTime?

The duration for which fetched data remains fresh.

### What is invalidateQueries?

Marks queries as stale and triggers refetching.

### What are Optimistic Updates?

Updating the UI before the server confirms the change.

### What is Prefetching?

Loading data before the user requests it.

---

# 🎯 Learning Outcomes

After completing Day-2, I can:

✅ Use React Query professionally

✅ Fetch data using useQuery

✅ Modify data using useMutation

✅ Handle loading and error states

✅ Implement query invalidation

✅ Understand caching and staleTime

✅ Explain React Query concepts in interviews

✅ Build scalable frontend applications

---

# 📌 Conclusion

Day-2 focused on professional server-state management using TanStack Query. I learned how modern applications like Amazon, Swiggy, Netflix, and Instagram optimize API communication using caching, mutations, invalidation, prefetching, and infinite scrolling.
