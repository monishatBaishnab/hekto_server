import catch_async from "../../utils/catch_async";
import { payment_services } from "./payment.services";

const success = catch_async(async (req, res) => {
  const { trans_id } = req?.query;
  const result = await payment_services.success(trans_id as string);

  res.send(result);
});
const failed = catch_async(async (req, res) => {
  const { trans_id } = req?.query;
  const result = await payment_services.failed(trans_id as string);

  res.send(result);
});

export const payment_controllers = { success, failed };
