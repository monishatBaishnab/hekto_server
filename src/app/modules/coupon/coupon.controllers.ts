import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";
import { coupon_services } from "./coupon.services";

// Controller to fetch all Coupons
const apply_coupon = catch_async(async (req, res) => {
  const result = await coupon_services.apply_coupon(req.body);
  send_response(res, {
    status: httpStatus.OK,
    message: "Coupon applied.",
    data: result,
  });
});

// Controller to fetch all Coupons
const fetch_all = catch_async(async (req, res) => {
  const result = await coupon_services.fetch_all_from_db(req.query);
  send_response(res, {
    status: httpStatus.OK,
    message: "Coupons retrieved successfully.",
    data: result.coupons,
    meta: result.meta,
  });
});

// Controller to create a new Coupon
const create_one = catch_async(async (req, res) => {
  const result = await coupon_services.create_one_into_db(req.body, req.user);

  send_response(res, {
    status: httpStatus.CREATED,
    message: "Coupon created successfully.",
    data: result,
  });
});

// Controller to update an existing Coupons by ID
const update_one = catch_async(async (req, res) => {
  const result = await coupon_services.update_one_from_db(req.params.id, req.body, req.user);

  send_response(res, {
    status: httpStatus.OK,
    message: "Coupons updated successfully.",
    data: result,
  });
});

// Controller to delete an existing Coupons by ID
const delete_one = catch_async(async (req, res) => {
  await coupon_services.delete_one_from_db(req.params.id, req.user);
  send_response(res, {
    status: httpStatus.OK,
    message: "Coupons deleted successfully.",
  });
});

export const coupon_controllers = {
  apply_coupon,
  fetch_all,
  create_one,
  update_one,
  delete_one,
};
