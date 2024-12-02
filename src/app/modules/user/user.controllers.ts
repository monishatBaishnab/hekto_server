import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";
import { user_services } from "./user.services";

// Controller to fetch all users
const fetch_all = catch_async(async (req, res) => {
  send_response(res, {
    status: httpStatus.OK,
    message: "Users retrieved successfully.",
  });
});

// Controller to fetch a single user by ID
const fetch_single = catch_async(async (req, res) => {
  send_response(res, {
    status: httpStatus.OK,
    message: "User retrieved successfully.",
  });
});

// Controller to create a new user
const create_one = catch_async(async (req, res) => {
  const result = await user_services.create_one_into_db(req.body, req.file);

  send_response(res, {
    status: httpStatus.CREATED,
    message: "User created successfully.",
    data: result
  });
});

// Controller to update an existing user by ID
const update_one = catch_async(async (req, res) => {
  send_response(res, {
    status: httpStatus.OK,
    message: "User updated successfully.",
  });
});

// Controller to delete an existing user by ID
const delete_one = catch_async(async (req, res) => {
  send_response(res, {
    status: httpStatus.OK,
    message: "User deleted successfully.",
  });
});

export const user_controllers = {
   fetch_all,
   fetch_single,
   create_one,
   update_one,
   delete_one,
};
