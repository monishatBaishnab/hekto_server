import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";
import { order_services } from "./order.services";

// Controller to delete an existing Orders by ID
const fetch_all = catch_async(async (req, res) => {
  const result = await order_services.fetch_all_from_db(req.query);

  send_response(res, {
    status: httpStatus.OK,
    message: "Orders retrieved successfully.",
    data: result.orders,
    meta: result.meta,
  });
});

// Controller to delete an existing Orders by ID
const fetch_my = catch_async(async (req, res) => {
  const result = await order_services.fetch_my_from_db(req.query, req.user);

  send_response(res, {
    status: httpStatus.OK,
    message: "My orders retrieved successfully.",
    data: result.orders,
    meta: result.meta,
  });
});

// Controller to delete an existing Orders by ID
const create_one = catch_async(async (req, res) => {
  const result = await order_services.create_one_into_db(req.body, req.user);
  send_response(res, {
    status: httpStatus.CREATED,
    message: "Order created successfully.",
    data: result,
  });
});

export const order_controllers = {
  fetch_all,
  fetch_my,
  create_one,
};
