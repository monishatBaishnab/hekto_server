import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";
import { shop_services } from "./shop.services";

// Controller to fetch a all Shop
const fetch_all = catch_async(async (req, res) => {
  const result = await shop_services.fetch_all_from_db(req.query);

  send_response(res, {
    status: httpStatus.OK,
    message: "Shops retrieved successfully.",
    data: result.data,
    meta: result.meta,
  });
});

// Controller to fetch a single Shop by ID
const fetch_single = catch_async(async (req, res) => {
  const result = await shop_services.fetch_single_from_db(req.params.id);

  send_response(res, {
    status: httpStatus.OK,
    message: "Shop retrieved successfully.",
    data: result,
  });
});

// Controller to create a shop
const create_one = catch_async(async (req, res) => {
  const result = await shop_services.create_one_from_db(req.body, req.file);

  send_response(res, {
    status: httpStatus.OK,
    message: "Shop retrieved successfully.",
    data: result,
  });
});

// Controller to update a single shop by ID
const update_one = catch_async(async (req, res) => {
  const result = await shop_services.update_one_from_db(req.params.id, req.body, req.file);

  send_response(res, {
    status: httpStatus.OK,
    message: "Shop retrieved successfully.",
    data:result
  });
});

export const shop_controllers = { fetch_all, fetch_single, create_one, update_one };
