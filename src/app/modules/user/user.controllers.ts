import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";
import { user_services } from "./user.services";

// Controller to fetch all users
const fetch_all = catch_async(async (req, res) => {
  const result = await user_services.fetch_all_from_db(req.query);

  send_response(res, {
    status: httpStatus.OK,
    message: "Users retrieved successfully.",
    data: result.users,
    meta: result.meta,
  });
});

// Controller to fetch a single user by ID
const fetch_single = catch_async(async (req, res) => {
  const result = await user_services.fetch_single_from_db(req.params.id);

  send_response(res, {
    status: httpStatus.OK,
    message: "User retrieved successfully.",
    data: result,
  });
});

// Controller to create a new user as 'ADMIN'
const create_admin = catch_async(async (req, res) => {
  const result = await user_services.create_admin_into_db(req.body, req.file);

  send_response(res, {
    status: httpStatus.CREATED,
    message: "Admin created successfully.",
    data: result,
  });
});

// Controller to update an existing user by ID
const update_one = catch_async(async (req, res) => {
  await user_services.update_one_from_db(req.params.id, req.body, req.file, req.user);

  send_response(res, {
    status: httpStatus.OK,
    message: "User updated successfully.",
  });
});

// Controller to update an existing user by ID
const update_status = catch_async(async (req, res) => {
  req.body;
  await user_services.update_status_from_db(req.params.id, req.body);

  send_response(res, {
    status: httpStatus.OK,
    message: "User status updated successfully.",
  });
});

// Controller to delete an existing user by ID
const delete_one = catch_async(async (req, res) => {
  await user_services.delete_one_from_db(req.params.id, req.user);

  send_response(res, {
    status: httpStatus.OK,
    message: "User deleted successfully.",
  });
});

export const user_controllers = {
  fetch_all,
  fetch_single,
  create_admin,
  update_one,
  update_status,
  delete_one,
};
