import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";

// Controller to fetch all Reviews
const fetch_all = catch_async(async (req, res) => {
  send_response(res, {
    status: httpStatus.OK,
    message: "Reviews retrieved successfully.",
  });
});

// Controller to fetch a single Reviews by ID
const fetch_single = catch_async(async (req, res) => {
  send_response(res, {
    status: httpStatus.OK,
    message: "Reviews retrieved successfully.",
  });
});

// Controller to create a new Review
const create_one = catch_async(async (req, res) => {

  send_response(res, {
    status: httpStatus.CREATED,
    message: "Review created successfully.",
  });
});

// Controller to update an existing Reviews by ID
const update_one = catch_async(async (req, res) => {
  send_response(res, {
    status: httpStatus.OK,
    message: "Reviews updated successfully.",
  });
});

// Controller to delete an existing Reviews by ID
const delete_one = catch_async(async (req, res) => {
  send_response(res, {
    status: httpStatus.OK,
    message: "Reviews deleted successfully.",
  });
});

export const review_controllers = {
   fetch_all,
   fetch_single,
   create_one,
   update_one,
   delete_one,
};
