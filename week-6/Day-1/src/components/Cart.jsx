import useCartStore from "../store/cartStore";

function Cart() {
  const cart = useCartStore(
    (state) => state.cart
  );

  const removeItem = useCartStore(
    (state) => state.removeItem
  );

  return (
    <div>
      <h2>Cart Items</h2>

      {cart.length === 0 ? (
        <p>Cart is Empty</p>
      ) : (
        cart.map((item) => (
          <div key={item.id}>
            <p>
              {item.name} - Qty: {item.qty}
            </p>

            <button
              onClick={() =>
                removeItem(item.id)
              }
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;