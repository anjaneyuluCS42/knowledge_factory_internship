import { useState } from "react";

function SearchBar() {

  const products = [
    "Apple",
    "Banana",
    "Mango",
    "Orange",
    "Grapes",
    "Watermelon"
  ];

  const [search, setSearch] =
    useState("");

  const filteredProducts =
    products.filter(product =>
      product
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div>

      <h2>
        Search Bar Component
      </h2>

      <input
        type="text"
        placeholder="Search Fruit"
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      <ul>

        {
          filteredProducts.map(
            (item, index) => (
              <li key={index}>
                {item}
              </li>
            )
          )
        }

      </ul>

    </div>
  );
}

export default SearchBar;