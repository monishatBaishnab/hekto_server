import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import send_response from "./app/utils/send_response";
import httpStatus from "http-status";
import catch_async from "./app/utils/catch_async";
import not_found from "./app/middlewares/not_found";
import global_error from "./app/middlewares/global_error";
import { app_routes } from "./app/routes";

// Create an instance of the Express application
const app: Application = express();

// Middlewares to parse json and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable Cross-Origin Resource Sharing (CORS) with specified options
app.use(
  cors({
    credentials: true,
    origin: [
      "*",
      "http://localhost:5173",
      "https://hekto-1a747.firebaseapp.com",
      "https://hekto-1a747.web.app",
    ],
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

// Define all routes for the application
app.use("/api/v1/", app_routes);

// Middleware to handle 404 (Not Found) errors
app.use("*", not_found);

// Middleware to handle global errors
app.use(global_error);

export default app;
