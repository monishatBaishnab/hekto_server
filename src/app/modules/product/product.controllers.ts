import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";
import { product_services } from "./product.services";

// Controller to fetch all Products
const fetch_all = catch_async(async (req, res) => {
  const result = await product_services.fetch_all_from_db(req.query);

  send_response(res, {
    status: httpStatus.OK,
    message: "Products retrieved successfully.",
    data: result.products,
    meta: result.meta,
  });
});

// Controller to fetch a single Product by ID
const fetch_single = catch_async(async (req, res) => {
  const result = await product_services.fetch_single_from_db(req.params.id);

  send_response(res, {
    status: httpStatus.OK,
    message: "Product retrieved successfully.",
    data: result,
  });
});

// Controller to create a new Product
const create_one = catch_async(async (req, res) => {
  const result = await product_services.create_one_into_db(req.body, req.file, req.user);

  send_response(res, {
    status: httpStatus.CREATED,
    message: "Product created successfully.",
    data: result,
  });
});

// Controller to update an existing Product by ID
const update_one = catch_async(async (req, res) => {
  const result = await product_services.update_one_from_db(req.params.id, req.body, req.file, req.user);
  send_response(res, {
    status: httpStatus.OK,
    message: "Product updated successfully.",
    data: result,
  });
});

// Controller to delete an existing Product by ID
const delete_one = catch_async(async (req, res) => {
  await product_services.delete_one_from_db(req.params.id, req.user);

  send_response(res, {
    status: httpStatus.OK,
    message: "Product deleted successfully.",
  });
});

export const product_controllers = {
  fetch_all,
  fetch_single,
  create_one,
  update_one,
  delete_one,
};
