import { Schema, model } from "mongoose";

export interface TokenInput extends Document {
  user: Schema.Types.ObjectId;
  refreshToken: string;
}

const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  refreshToken: { type: String, required: true },
});

const TokenModel = model<TokenInput>("Token", TokenSchema);

export default TokenModel;
