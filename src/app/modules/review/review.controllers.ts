import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";
import { review_services } from "./review.serviecs";

// Controller to fetch all Reviews
const fetch_all = catch_async(async (req, res) => {
  const result = await review_services.fetch_all_from_db(req.query);
  send_response(res, {
    status: httpStatus.OK,
    message: "Reviews retrieved successfully.",
    data: result.reviews,
    meta: result.meta,
  });
});

// Controller to create a new Review
const create_one = catch_async(async (req, res) => {
  const result = await review_services.create_one_into_db(req.body, req.user);

  send_response(res, {
    status: httpStatus.CREATED,
    message: "Review created successfully.",
    data: result,
  });
});

// Controller to update an existing Reviews by ID
const update_one = catch_async(async (req, res) => {
  const result = await review_services.update_one_from_db(req.params.id, req.body, req.user);

  send_response(res, {
    status: httpStatus.OK,
    message: "Reviews updated successfully.",
    data: result,
  });
});

// Controller to delete an existing Reviews by ID
const delete_one = catch_async(async (req, res) => {
  await review_services.delete_one_from_db(req.params.id, req.user);
  send_response(res, {
    status: httpStatus.OK,
    message: "Reviews deleted successfully.",
  });
});

export const review_controllers = {
  fetch_all,
  create_one,
  update_one,
  delete_one,
};
