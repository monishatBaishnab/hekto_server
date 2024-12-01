import { Response } from "express";

type TPayload<T, M> = {
  success?: boolean;
  status: number;
  message: string;
  data?: T;
  meta?: M;
};

const send_response = <T, M>(res: Response, payload: TPayload<T, M>) => {
  const response_data = {
    success: payload?.success ?? true,
    ...payload,
  };

  res.status(payload.status).send(response_data);
};

export default send_response;
