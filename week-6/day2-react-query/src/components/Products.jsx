import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchProducts, addProduct } from "../api/productsApi";
import { useQueryClient } from "@tanstack/react-query";

function Products() {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 10000,
  });
  const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: addProduct,

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["products"],
    });

    alert("Product Added Successfully");
  },
    onError: () => {
    alert("Something Went Wrong");
    },
});

  if (isLoading) {
    return (
    <div>
    <h2>⌛Loading...</h2>
    </div>
    );
  }

 if (error) {
  return (
    <div>
      <h2>Something went wrong!</h2>

      <button onClick={() => refetch()}>
        Try Again
      </button>
    </div>
  );
}

  return (
    <div>
      <button onClick={() => refetch()}>
        Refresh Products
      </button>

      <button
        onClick={() =>
          mutation.mutate({
            title: "New Laptop",
            price: 50000,
            description: "Gaming Laptop",
            category: "electronics",
          })
        }
      >
        Add Product
      </button>

      <h1>Products</h1>

      {data.map((product) => (
        <div key={product.id}>
          <img
            src={product.image}
            alt={product.title}
            style={{
              width: "150px",
              height: "150px",
              objectFit: "contain",
            }}
          />

          <h3>{product.title}</h3>
          <p>${product.price}</p>
          <p>{product.description}</p>
          <p>{product.category}</p>
          <p>Rating: {product.rating.rate}</p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Products;