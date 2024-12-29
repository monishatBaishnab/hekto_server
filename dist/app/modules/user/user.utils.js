"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarize_orders_by_date = void 0;
const summarize_orders_by_date = (orders) => {
    const grouped = orders.reduce((acc, order) => {
        const date = new Date(order.createdAt).toISOString().split("T")[0]; // Extract date only (YYYY-MM-DD)
        if (!acc[date]) {
            acc[date] = { total_price: 0, order_count: 0 };
        }
        acc[date].total_price += order.total_price;
        acc[date].order_count += 1;
        return acc;
    }, {});
    return Object.entries(grouped).map(([date, { total_price, order_count }]) => ({
        date,
        total_price,
        order_count,
    }));
};
exports.summarize_orders_by_date = summarize_orders_by_date;
