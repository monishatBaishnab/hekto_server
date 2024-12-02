import { User, UserRole } from "@prisma/client";
import { Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";

// Define the structure of the token payload
export type TTokenData = {
  id: string;
  email: string;
  role: UserRole;
};

// Function to sanitize and structure user data for token creation
export const sanitize_token_data = (userData: User): TTokenData => {
  const tokenData = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  return tokenData;
};

// Function to generate a JSON Web Token (JWT) using the provided payload and secret
export const generate_token = (payload: TTokenData, secret: Secret, expiresIn = "10d") => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};

// Function to verify the provided token and extract the payload data
export const verify_token = (token: string, secret: Secret): TTokenData => {
  const verified_user = jwt.verify(token, secret);
  return verified_user as TTokenData;
};
