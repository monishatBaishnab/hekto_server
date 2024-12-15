import axios from "axios";
import { local_config } from "../../config";

type TPaymentInfo = {
  amount: number;
  trans_id: string;
  customer: {
    name: string;
    email: string;
  };
};

export const initiate_payment = async (paymentInfo: TPaymentInfo) => {
  const result = await axios.post(local_config.base_url as string, {
    store_id: local_config.store_id,
    signature_key: local_config.signature_key,
    success_url: `https://hekto-server.vercel.app/api/v1/payments/success?trans_id=${paymentInfo.trans_id}`,
    fail_url: `https://hekto-server.vercel.app/api/v1/payments/failed?trans_id=${paymentInfo.trans_id}`,
    cancel_url: `https://hekto-1a747.web.app/`,
    tran_id: paymentInfo.trans_id,
    amount: paymentInfo.amount.toString(),
    currency: "BDT",
    cus_name: paymentInfo.customer.name,
    cus_email: paymentInfo.customer.email,
    cus_phone: "019838",
    cus_add1: null,
    cus_country: null,
    cus_city: null,
    cus_state: null,
    cus_postcode: null,
    desc: "Simple Description.",
    cus_add2: null,
    type: "json",
  });

  return result?.data;
};

export const generate_tran_id = (): string => {
  const prefix = "TXN";
  const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000); // Generates a 10-digit random number
  return `${prefix}${randomNumber}`;
};
