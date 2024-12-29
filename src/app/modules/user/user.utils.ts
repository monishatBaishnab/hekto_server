import { Order } from "@prisma/client";

type Summary = {
  date: string;
  total_price: number;
  order_count: number;
};

export const summarize_orders_by_date = (orders: Order[]): Summary[] => {
  const grouped = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toISOString().split("T")[0]; // Extract date only (YYYY-MM-DD)
    if (!acc[date]) {
      acc[date] = { total_price: 0, order_count: 0 };
    }
    acc[date].total_price += order.total_price;
    acc[date].order_count += 1;
    return acc;
  }, {} as Record<string, { total_price: number; order_count: number }>);

  return Object.entries(grouped).map(([date, { total_price, order_count }]) => ({
    date,
    total_price,
    order_count,
  }));
};
