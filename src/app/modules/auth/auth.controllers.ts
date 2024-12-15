import httpStatus from "http-status";
import catch_async from "../../utils/catch_async";
import send_response from "../../utils/send_response";
import { auth_services } from "./auth.services";

const login = catch_async(async (req, res) => {
  const result = await auth_services.login(req.body);

  send_response(res, {
    status: httpStatus.OK,
    message: "User logged in successfully.",
    data: result,
  });
});

const forgot_pass = catch_async(async (req, res) => {
  const result = await auth_services.forgot_pass(req.body);

  send_response(res, {
    status: httpStatus.OK,
    message: "Check your email.",
    data: result,
  });
});

const reset_pass = catch_async(async (req, res) => {
  const result = await auth_services.reset_pass_from_db(
    req.headers.authorization as string,
    req.body
  );

  send_response(res, {
    status: httpStatus.OK,
    message: "Password Reset Successfully.",
    data: result,
  });
});

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
  register,
  forgot_pass,
  reset_pass,
  login,
};
