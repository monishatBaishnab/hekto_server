import { RequestHandler } from "express";
import send_response from "../utils/send_response";

const not_found: RequestHandler = (req, res) => {
  send_response(res, {
    success: false,
    status: 404,
    message: `The API endpoint '${req?.baseUrl}' was not found.`,
  });
};

export default not_found;
