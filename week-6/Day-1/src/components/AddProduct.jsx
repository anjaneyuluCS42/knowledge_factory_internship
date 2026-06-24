import { useMutation } from "@tanstack/react-query";
import {addProduct} from "../api/addProduct";

function AddProduct() {

 const mutation =
 useMutation({

  mutationFn:
   addProduct,

 });

 const handleAdd = () => {

  mutation.mutate({

   id:4,

   name:"Laptop",

   price:70000

  });

 };

return (
  <div>

    <h2>Add Product</h2>

    <button onClick={handleAdd}>
      Add Laptop
    </button>

    {mutation.isPending && (
      <p>Adding Product...</p>
    )}

    {mutation.isSuccess && (
      <p>Product Added Successfully ✅</p>
    )}

    {mutation.isError && (
      <p>Something Went Wrong ❌</p>
    )}

  </div>
);

}

export default AddProduct;