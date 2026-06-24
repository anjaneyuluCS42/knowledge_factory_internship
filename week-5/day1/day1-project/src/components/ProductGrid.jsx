import ProductCard from "./ProductCard"

function ProductGrid() {

  const products = [
    {
      id: 1,
      name: "iPhone 15",
      price: 70000,
      image: "https://via.placeholder.com/200"
    },

    {
      id: 2,
      name: "Laptop",
      price: 55000,
      image: "https://via.placeholder.com/200"
    },

    {
      id: 3,
      name: "Headphones",
      price: 3000,
      image: "https://via.placeholder.com/200"
    }
  ]

  return (
    <div className="grid">

      {products.map(product => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
        />
      ))}

    </div>
  )
}

export default ProductGrid