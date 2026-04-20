import { SignJWT, JWTPayload as JoseJWTPayload, jwtVerify } from "jose";
import { createSecretKey } from "node:crypto";

export interface JWTPayload extends JoseJWTPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable not set");
  return createSecretKey(secret, "utf-8");
};

export const generateToken = async (payload: JWTPayload): Promise<string> => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
    .sign(getSecretKey());
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  const { payload } = await jwtVerify(token, getSecretKey());
  return payload as JWTPayload;
};
