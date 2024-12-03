import { TOrderProduct } from "./order.types";

// Function to calculate the total price of a list of order products
export const calculate_total_price = (products: TOrderProduct[]) => {
  // Using the reduce method to iterate through the array of products
  const total_price = products?.reduce((price, product) => {
    return price + Number(product.quantity) * Number(product.price);
  }, 0);
  return total_price;
};
