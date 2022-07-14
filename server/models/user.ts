import { Schema, model } from "mongoose";

interface IUser {
  email: string,
  password: string,
  pw_reset_token?: string,
  pw_reset_token_expire?: string,
  admin: boolean,
  associated_member_id?: number,
  qr_token?: string,
  qr_token_expire?: string
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  pw_reset_token: String,
  pw_reset_token_expire: String,
  admin: { type: Boolean, required: true },
  associated_member_id: Number,
  qr_token: String,
  qr_token_expire: String
});

const User = model<IUser>('User', userSchema, 'user');
export default User;