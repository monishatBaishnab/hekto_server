import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";

// Controller to fetch all Products
const fetch_all = catch_async(async (req, res) => {
  send_response(res, {
    status: httpStatus.OK,
    message: "Products retrieved successfully.",
  });
});

// Controller to fetch a single Product by ID
const fetch_single = catch_async(async (req, res) => {
  send_response(res, {
    status: httpStatus.OK,
    message: "Product retrieved successfully.",
  });
});

// Controller to create a new Product as 'ADMIN'
const create_one = catch_async(async (req, res) => {

  send_response(res, {
    status: httpStatus.CREATED,
    message: "Admin created successfully.",
  });
});

// Controller to update an existing Product by ID
const update_one = catch_async(async (req, res) => {
  send_response(res, {
    status: httpStatus.OK,
    message: "Product updated successfully.",
  });
});

// Controller to delete an existing Product by ID
const delete_one = catch_async(async (req, res) => {
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
