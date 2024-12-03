"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculate_total_price = void 0;
// Function to calculate the total price of a list of order products
const calculate_total_price = (products) => {
    // Using the reduce method to iterate through the array of products
    const total_price = products === null || products === void 0 ? void 0 : products.reduce((price, product) => {
        return price + Number(product.quantity) * Number(product.price);
    }, 0);
    return total_price;
};
exports.calculate_total_price = calculate_total_price;
