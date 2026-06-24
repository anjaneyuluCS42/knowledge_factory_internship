import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Counter from "./components/Counter";
import Product from "./components/Product";
import Cart from "./components/Cart";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";

function App() {

  return (
    <div>

      <h1>
        Context API Demo
      </h1>
      <h2>
        Zustand Demo
      </h2>
      <h3> Cart Store Demo</h3>
      <Navbar />
      <hr />
      <Profile />
      <hr/>
      <Counter />
      <hr/>
      <Product />
      <hr/>
       <Cart />
       <hr/>
       <ProductList />
       <hr/>
       <AddProduct />

      

    </div>
  );
}

export default App;





