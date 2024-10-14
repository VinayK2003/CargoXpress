import { Schema, model } from "mongoose";

interface User {
  username: string;
  password: string;
  role: "user" | "driver" | "admin";
}

const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "driver", "admin"], required: true },
});

const UserModel = model<User>("User", userSchema);

export default UserModel;
