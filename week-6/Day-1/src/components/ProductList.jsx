import { useQuery }
from "@tanstack/react-query";

import {
 getProducts
}
from "../api/products";

function ProductList() {

 const {
  data,
  isLoading,
  error
 } = useQuery({

  queryKey:["products"],

  queryFn:getProducts

 });

 if(isLoading)
  return <h2>Loading...</h2>;

 if(error)
  return <h2>Error</h2>;

 return (

  <div>

   <h2>
    Products
   </h2>

   {
    data.map(product=>(
      <p key={product.id}>
        {product.name}
        -
        ₹{product.price}
      </p>
    ))
   }

  </div>

 );

}

export default ProductList;