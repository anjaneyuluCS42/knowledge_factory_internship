import axios from "axios";

export const fetchProducts = async () => {
  const response = await axios.get(
    "https://fakestoreapi.com/products"
  );

  return response.data;
};

export const addProduct = async (newProduct) => {
  const response = await axios.post(
    "https://fakestoreapi.com/products",
    newProduct
  );

  return response.data;
};