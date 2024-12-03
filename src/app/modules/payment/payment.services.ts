import httpStatus from "http-status";
import path from "path";
import http_error from "../../errors/http_error";
import { promises as fs } from "fs";
import axios from "axios";
import { local_config } from "../../config";
import prisma from "../../utils/prisma";
import { PaymentStatus } from "@prisma/client";

const success = async (trans_id: string) => {
  const filePath = path.join(__dirname, "../../views/success.html");

  try {
    const data = await fs.readFile(filePath, "utf8");
    const checkPayment = await axios.get(
      `https://sandbox.aamarpay.com/api/v1/trxcheck/request.php?request_id=${trans_id}&store_id=${local_config.store_id}&signature_key=${local_config.signature_key}&type=json`
    );

    if (checkPayment?.data?.pay_status === "Successful") {
      await prisma.order.updateMany({
        where: { transaction_id: trans_id },
        data: { payment_status: PaymentStatus.COMPLETED },
      });
    }

    return data;
  } catch (error) {
    throw new http_error(Number(httpStatus[500]), "Error reading file");
  }
};

const failed = async (trans_id: string) => {
  const filePath = path.join(__dirname, "../../views/failed.html");
  try {
    const data = await fs.readFile(filePath, "utf8");
    await prisma.order.updateMany({
      where: { transaction_id: trans_id },
      data: { payment_status: PaymentStatus.FAILED },
    });
    return data;
  } catch (error) {
    throw new http_error(Number(httpStatus[500]), "Error reading file");
  }
};

export const payment_services = { success, failed };
