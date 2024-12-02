import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";
import { auth_services } from "./auth.services";

// Controller to register a new user
const register = catch_async(async (req, res) => {
  const result = await auth_services.register_into_db(req.body, req.file);

  send_response(res, {
    status: httpStatus.CREATED,
    message: "User registered successfully.",
    data: result,
  });
});

export const auth_controllers = {
    register
}