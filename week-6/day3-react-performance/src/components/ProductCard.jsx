import React from "react";

/*
=====================================
React.memo

Only re-render
when props change.

=====================================
*/

const ProductCard = React.memo(

  ({ product, onAddToCart }) => {

    console.log(
      "Rendering:",
      product.name
    );

    return (

      <div

        style={{

          border: "1px solid gray",

          padding: "15px",

          margin: "10px",

          borderRadius: "10px",

        }}

      >

        <h3>

          {product.name}

        </h3>

        <button

          onClick={() =>
            onAddToCart(product)
          }

        >

          Add To Cart

        </button>

      </div>

    );

  }

);

export default ProductCard;