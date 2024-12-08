import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";
import { category_services } from "./category.services";

// Controller to fetch all categories
const fetch_all = catch_async(async (req, res) => {
  const result = await category_services.fetch_all_from_db(req.query);

  send_response(res, {
    status: httpStatus.OK,
    message: "Categories retrieved successfully.",
    data: result.categories,
    meta: result.meta,
  });
});

// Controller to fetch a single Category by ID
const fetch_single = catch_async(async (req, res) => {
  send_response(res, {
    status: httpStatus.OK,
    message: "Category retrieved successfully.",
  });
});

// Controller to create a new Category as 'ADMIN'
const create_one = catch_async(async (req, res) => {
  const result = await category_services.create_one_into_db(req.body, req.file);

  send_response(res, {
    status: httpStatus.CREATED,
    message: "Category created successfully.",
    data: result,
  });
});

// Controller to update an existing Category by ID
const update_one = catch_async(async (req, res) => {
  send_response(res, {
    status: httpStatus.OK,
    message: "Category updated successfully.",
  });
});

// Controller to delete an existing Category by ID
const delete_one = catch_async(async (req, res) => {
  send_response(res, {
    status: httpStatus.OK,
    message: "Category deleted successfully.",
  });
});

export const category_controllers = {
  fetch_all,
  fetch_single,
  create_one,
  update_one,
  delete_one,
};
