function ProductCard({ name, price, image }) {
  return (
    <div className="card">
      <img src={image} alt={name} width="200" />

      <h2>{name}</h2>

      <p>₹{price}</p>

      <button>Add To Cart</button>
    </div>
  )
}

export default ProductCard