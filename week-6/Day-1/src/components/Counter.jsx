import useCounterStore
from "../store/counterStore";

function Counter() {

 const count =
 useCounterStore(
  (state) => state.count
 );

 const increment =
 useCounterStore(
  (state) => state.increment
 );

 const decrement =
 useCounterStore(
  (state) => state.decrement
 );

 return (
  <div>

   <h2>
    Count : {count}
   </h2>

   <button
    onClick={increment}
   >
    +
   </button>

   <button
    onClick={decrement}
   >
    -
   </button>

  </div>
 );
}

export default Counter;