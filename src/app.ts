import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import send_response from "./app/utils/send_response";
import httpStatus from "http-status";
import catch_async from "./app/utils/catch_async";
import not_found from "./app/middlewares/not_found";
import global_error from "./app/middlewares/global_error";

// Create an instance of the Express application
const app = express();

// Middlewares to parse json and cookies
app.use(express.json());
app.use(cookieParser());

// Enable Cross-Origin Resource Sharing (CORS) with specified options
app.use(
  cors({
    credentials: true,
    origin: ["*"],
  })
);

// Define a GET route for the root URL
app.get(
  "/",
  catch_async((req, res) => {
    send_response(res, {
      success: true,
      status: httpStatus.OK,
      message: "Hekto Server Running Smoothly.",
    });
  })
);

// Middleware to handle 404 (Not Found) errors
app.use("*", not_found);

// Middleware to handle global errors
app.use(global_error);

export default app;
