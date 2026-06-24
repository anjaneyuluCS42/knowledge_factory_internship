// export const addProduct = async (
//   product
// ) => {

//   console.log(
//     "Sending Product:",
//     product
//   );

//   return product;
// };


export const addProduct = async (
 product
) => {

 await new Promise(
  (resolve) =>
   setTimeout(resolve, 3000)
 );

 console.log(
  "Sending Product:",
  product
 );

 return product;

};

//isError Test

// export const addProduct = async (
//  product
// ) => {

//  throw new Error(
//   "Server Error"
//  );

// };