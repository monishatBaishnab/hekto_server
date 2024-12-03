import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";
import { follow_services } from "./follow.services";

const follow_shop = catch_async(async (req, res) => {
  const result = await follow_services.follow_shop(req.body, req.user);

  send_response(res, {
    status: httpStatus.OK,
    message: "User registered successfully.",
    data: result,
  });
});

export const follow_controllers = { follow_shop };
