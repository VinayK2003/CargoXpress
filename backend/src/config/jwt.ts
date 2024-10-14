import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

const JWT_EXPIRES_IN = "1h"; // Token expiration time

export { JWT_SECRET, JWT_EXPIRES_IN };
