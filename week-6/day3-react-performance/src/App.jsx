import { lazy, Suspense } from "react";
 
import ErrorBoundary from "./components/ErrorBoundary";

// import CrashComponent from "./components/CrashComponent";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

/*
=========================================
Lazy Loading
=========================================

These pages are NOT downloaded immediately.

React downloads them only
when user visits that page.
*/

const Home = lazy(() =>
  import("./pages/Home")
);

const About = lazy(() =>
  import("./pages/About")
);

const Contact = lazy(() =>
  import("./pages/Contact")
);

/*
Performance Page

This page contains

✔ useMemo
✔ React.memo
✔ useCallback
✔ useDebounce
✔ useLocalStorage
✔ useMediaQuery

Entire page is lazy loaded.
*/

const Performance = lazy(() =>
  import("./pages/Performance")
);

function App() {

  return (

    <BrowserRouter>
    <ErrorBoundary>

{/* <Home /> */}

</ErrorBoundary>

      <div
        style={{
          padding: "20px",
        }}
      >

        <h1>
          🚀 React Performance Day-3
        </h1>

        <nav>

          <Link to="/">
            Home
          </Link>

          {" | "}

          <Link to="/about">
            About
          </Link>

          {" | "}

          <Link to="/contact">
            Contact
          </Link>

          {" | "}

          <Link to="/performance">
            Performance Demo
          </Link>

        </nav>

        <hr />

        {/*
        Suspense

        While downloading
        lazy component

        show Loading...
        */}

        <Suspense
          fallback={
            <h2>
              🔄 Loading Page...
            </h2>
          }
        >

          <Routes>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/about"
              element={<About />}
            />

            <Route
              path="/contact"
              element={<Contact />}
            />

            <Route
              path="/performance"
              element={
                <Performance />
              }
            />

          </Routes>

        </Suspense>

      </div>

    </BrowserRouter>
    

  );
}

export default App;