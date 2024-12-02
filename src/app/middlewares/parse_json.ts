import { RequestHandler } from "express";

const parse_json: RequestHandler = (req, res, next) => {
  req.body = JSON.parse(req.body.data);
  next();
};

export default parse_json;
