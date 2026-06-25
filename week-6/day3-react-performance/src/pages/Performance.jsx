import {
  useState,
  useMemo,
  useCallback,
} from "react";

import ProductCard from "../components/ProductCard";

import useDebounce from "../hooks/useDebounce";
import useLocalStorage from "../hooks/useLocalStorage";
import useMediaQuery from "../hooks/useMediaQuery";

function Performance() {

  /*
  =====================================
  Search State
  =====================================
  */

 const [search, setSearch] =
  useLocalStorage(
    "search",
    ""
  );

  const [cart, setCart] =
  useLocalStorage(
    "cart",
    []
  );

  /*
  =====================================
  Debounced Search
  =====================================
  */

  const debouncedSearch =
    useDebounce(
      search,
      500
    );

    

  /*
  =====================================
  Theme using LocalStorage
  =====================================
  */

  const [theme, setTheme] =
    useLocalStorage(
      "theme",
      "light"
    );

  /*
  =====================================
  Detect Mobile/Desktop
  =====================================
  */

  const isMobile =
    useMediaQuery(
      "(max-width:768px)"
    );

  /*
  =====================================
  Fake Products
  =====================================
  */

  const products =
    Array.from(
      { length: 1000 },
      (_, index) => ({
        id: index,
        name: `Product ${index}`,
      })
    );

  /*
  =====================================
  useMemo
  Expensive filtering
  =====================================
  */

  const filteredProducts =
    useMemo(() => {

      console.log(
        "Filtering Products..."
      );

      return products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(
              debouncedSearch.toLowerCase()
            )
      );

    }, [debouncedSearch]);

  /*
  =====================================
  useCallback
  =====================================
  */
 

  const handleAddToCart =
  useCallback(

    (product) => {

      setCart((previousCart) => [

        ...previousCart,

        product,

      ]);

      console.log(
        "Added:",
        product.name
      );

    },

    [setCart]

  );

  return (

    <div
      style={{
        padding: "20px",
      }}
    >

      <h1>
        🚀 React Performance Demo
      </h1>

      <hr />

      <h2>
        Theme :
        {" "}
        {theme}
      </h2>

      <button

        onClick={() =>
          setTheme(
            theme === "light"
              ? "dark"
              : "light"
          )
        }

      >

        Change Theme

      </button>

      <br />
      <br />

      <h2>

        Device :

        {isMobile
          ? " 📱 Mobile"
          : " 💻 Desktop"}

      </h2>

      <br />

      {isMobile ? (

        <button>
          ☰ Menu
        </button>

      ) : (

        <button>
          Home |
          Products |
          Cart |
          Profile
        </button>

      )}

      <br />
      <br />

      <input

        type="text"

        placeholder="Search Product"

        value={search}

        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }

      />

      <h3>

        Search :

        {search}

      </h3>

      <h3>
  🛒 Cart Items :
  {cart.length}
</h3>

      <h3>

        Debounced Search :

        {debouncedSearch}

      </h3>

      <h3>

        Total Products :

        {filteredProducts.length}

      </h3>

      <hr />

      
            {/*
      =====================================
      Product Cards
      =====================================
      */}

                <hr />

<h2>🛒 Shopping Cart</h2>

<button

  onClick={() =>
    setCart([])
  }

>

  🗑 Clear Cart

</button>

<br />
<br />

{
  cart.length === 0 ? (

    <p>Cart is Empty</p>

  ) : (

    cart.map((item, index) => (

      <div
        key={index}
        style={{
          border: "1px solid gray",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "8px",
        }}
      >

        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>

  <h4>{item.name}</h4>

  <button

    onClick={() => {

      const updatedCart =
        cart.filter(
          (_, i) => i !== index
        );

      setCart(updatedCart);

    }}

  >

    ❌ Remove

  </button>

</div>

      </div>

    ))

  )
}

<hr />




      {filteredProducts
        .slice(0, 20)
        .map((product) => (

          <ProductCard

            key={product.id}

            product={product}

            onAddToCart={
              handleAddToCart
            }

          />

        ))}

    </div>

  );

}

export default Performance;