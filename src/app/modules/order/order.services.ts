import { Order, PaymentMethod } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../utils/prisma";
import { generate_tran_id, initiate_payment } from "../payment/payment.utils";
import { TOrderProducts } from "./order.types";
import { calculate_total_price } from "./order.utils";
import sanitize_paginate from "../../utils/sanitize_paginate";
import wc_builder from "../../utils/wc_builder";

const order_filterable_filds = ["payment_method", "payment_status", "order_status"];

const fetch_all_from_db = async (query: Record<string, unknown>) => {
  // Sanitize query parameters for pagination and sorting
  const { page, limit, skip, sortBy, sortOrder } = sanitize_paginate(query);

  // Build where conditions based on the query (e.g., filtering by "payment_method", "payment_status", "order_status")
  const whereConditions = wc_builder(query, [], order_filterable_filds);

  // Fetch orders from the database with the applied conditions, pagination, and sorting
  const orders = await prisma.order.findMany({
    where: {
      AND: whereConditions,
    },
    skip: skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      orderProduct: { select: { product: { select: { id: true, name: true, images: true } } } },
      user: { select: { id: true, email: true, profilePhoto: true, name: true } },
    },
  });

  const total = await prisma.order.count({
    where: { AND: whereConditions },
  });

  // Return the list of orders
  return { orders: orders, meta: { limit, page, total } };
};

const fetch_my_from_db = async (query: Record<string, unknown>, user: JwtPayload) => {
  // Sanitize query parameters for pagination and sorting
  const { page, limit, skip, sortBy, sortOrder } = sanitize_paginate(query);

  // Build where conditions based on the query (e.g., filtering by "payment_method", "payment_status", "order_status")
  const whereConditions = wc_builder(query, [], order_filterable_filds);
  const { shop_id } = query;
  // Fetch orders from the database with the applied conditions, pagination, and sorting
  const orders = await prisma.order.findMany({
    where: {
      AND: [
        ...whereConditions, // Ensure whereConditions is correctly formed as an array
        shop_id ? { orderProduct: { some: { product: { shop_id } } } } : { user_id: user.id },
      ],
    },
    skip: skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      orderProduct: { select: { product: { select: { id: true, name: true, images: true } } } },
      user: { select: { id: true, email: true, profilePhoto: true, name: true } },
    },
  });

  const total = await prisma.order.count({
    where: {
      AND: [
        {
          AND: whereConditions,
        },
        {
          user_id: user.id,
        },
      ],
    },
  });

  // Return the list of orders
  return { orders: orders, meta: { limit, page, total } };
};

const create_one_into_db = async (data: Order & TOrderProducts, user: JwtPayload) => {
  const { products, total_price: t_price, ...payload } = data ?? {};
  const user_info = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
  });

  const trans_id = generate_tran_id();

  const payment_data = {
    trans_id,
    amount: t_price,
    customer: { name: user_info.name, email: user_info.email },
  };

  const payment = await initiate_payment(payment_data);

  await prisma.$transaction(async (prisma_t) => {
    const order_data = {
      payment_method: PaymentMethod.AMARPAY,
      transaction_id: trans_id,
      user_id: user_info.id,
      total_price: t_price,
    };

    const created_order = await prisma_t.order.create({
      data: order_data,
    });

    for (const product of products || []) {
      const order_product_data = {
        order_id: created_order.id,
        price: Number(product.price),
        product_id: product.id,
        quantity: Number(product.quantity),
      };

      await prisma_t.orderProduct.create({
        data: order_product_data,
      });
    }
    return;
  });

  return payment;
};

export const order_services = {
  fetch_all_from_db,
  fetch_my_from_db,
  create_one_into_db,
};
