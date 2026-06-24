# React State Management - Day 1

## Overview

This project demonstrates modern React state management techniques using Context API, Zustand, Persist Middleware, and React Query (TanStack Query). The goal is to understand how data is shared across components, how global state is managed efficiently, and how API data is fetched and updated in React applications.

---

## Topics Covered

### 1. Context API

Implemented React Context API for authentication state management.

#### Features

* createContext()
* Provider
* useContext()
* Login functionality
* Logout functionality
* Current user management

#### Files

* src/context/AuthContext.jsx
* src/components/Navbar.jsx
* src/components/Profile.jsx

#### Purpose

Used to share authentication data across multiple components without prop drilling.

---

### 2. Zustand State Management

Implemented Zustand for lightweight global state management.

#### Features

* create store
* selectors
* actions
* global state sharing

#### Files

* src/store/counterStore.js
* src/components/Counter.jsx

#### Purpose

Used for efficient state management with fewer re-renders compared to Context API.

---

### 3. Cart Store using Zustand

Built a shopping cart store similar to Amazon/Flipkart applications.

#### Features

* Add Product
* Remove Product
* Quantity Management
* Shared Cart State

#### Files

* src/store/cartStore.js
* src/components/Product.jsx
* src/components/Cart.jsx

#### Purpose

Manage cart state globally across the application.

---

### 4. Persist Middleware

Implemented Zustand Persist Middleware.

#### Features

* Store cart data in localStorage
* Restore cart after browser refresh
* Persistent user experience

#### Files

* src/store/cartStore.js

#### Purpose

Ensures cart data is not lost after page reload.

---

### 5. React Query (TanStack Query)

Implemented React Query for server state management.

#### Features

* QueryClient setup
* QueryClientProvider
* useQuery()
* Data caching
* Automatic loading and error handling

#### Files

* src/queryClient.js
* src/api/products.js
* src/components/ProductList.jsx

#### Purpose

Fetch and cache API data efficiently.

---

### 6. React Query Mutations

Implemented useMutation() for data modification operations.

#### Features

* POST request simulation
* Mutation states
* isPending
* isSuccess
* isError

#### Files

* src/api/addProduct.js
* src/components/AddProduct.jsx

#### Purpose

Handle create/update/delete operations in React applications.

---

## Concepts Learned

### Context API

Used for:

* Authentication
* Theme Management
* Language Preferences

### Zustand

Used for:

* Cart State
* Wishlist
* Dashboard State
* Global Application State

### Persist Middleware

Used for:

* Saving state in localStorage
* Maintaining data after refresh

### React Query

Used for:

* API Data Fetching
* Data Caching
* Background Updates
* Mutation Handling

---

## Project Flow

Authentication
↓
Context API

Cart Management
↓
Zustand

Cart Persistence
↓
Persist Middleware

Products API
↓
React Query useQuery

Create Product
↓
React Query useMutation

---

## Technologies Used

* React
* Vite
* Context API
* Zustand
* Zustand Persist Middleware
* React Query (TanStack Query)
* JavaScript (ES6+)

---

## Learning Outcome

After completing this project:

* Understand when local state is not enough
* Use Context API for authentication
* Use Zustand for global state management
* Persist data using localStorage
* Fetch API data using React Query
* Perform create/update/delete operations using useMutation
* Understand caching and server state management

---

## Future Enhancements

* Connect to FastAPI Backend
* Axios Integration
* Product CRUD Operations
* Wishlist Module
* Order Management
* Authentication API Integration
* E-Commerce Application Development
