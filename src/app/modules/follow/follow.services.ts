import { Follow } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../utils/prisma";
import http_error from "../../errors/http_error";
import httpStatus from "http-status";

const follow_shop = async (payload: Follow, user: JwtPayload) => {
  const shop_info = await prisma.shop.findUniqueOrThrow({
    where: { id: payload.shop_id },
  });
  const user_info = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
  });

  if (shop_info.user_id === user_info.id) {
    throw new http_error(httpStatus.BAD_REQUEST, "You can not follow your own shop.");
  }

  const follow = await prisma.follow.create({
    data: { shop_id: shop_info.id, user_id: user_info.id },
  });

  return follow;
};

export const follow_services = { follow_shop };
