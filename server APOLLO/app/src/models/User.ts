import { Schema, model, Document } from "mongoose";

export interface UserInput extends Document {
  email: string;
  password: string;
  isActivated: Boolean;
  activationLink: string;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
}, {versionKey: false});

const UserModel = model<UserInput>("User", UserSchema);

export default UserModel;
