import useCartStore from "../store/cartStore";

function Product() {

 const addItem =
 useCartStore(
  (state)=>state.addItem
 );

 const phone = {
   id:1,
   name:"iPhone",
   price:50000,
   qty:1,

//    id :2,
//    name: "VivoT2pro",
//    price:24000,
//    qty1,
 };

 return (
  <div>

   <h2>iPhone</h2>

   <p>₹50000</p>

   <button
    onClick={() =>
      addItem(phone)
    }
   >
    Add To Cart
   </button>

  </div>
 );
}

export default Product;