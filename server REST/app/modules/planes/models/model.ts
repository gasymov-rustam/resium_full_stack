import { UserInput } from "./../../auth/models/user.model";
import mongoose, { Types } from "mongoose";
import { customAlphabet } from "nanoid";

// const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

export interface CoordsInput {
  longitude: number;
  latitude: number;
  height: number;
}

export interface PlaneInput {
  userId: UserInput["_id"];
  name: string;
  color: string;
  size: number;
  timeStepInSeconds: number;
  radius: number;
  targetCoords: CoordsInput;
  flightWay: [CoordsInput];
}

export interface PlaneDocument extends PlaneInput, mongoose.Document {
  // id: mongoose.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const coords = new mongoose.Schema(
  {
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  { versionKey: false, _id: false }
);

const PlaneSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, unique: true },
    color: { type: String, required: true },
    size: { type: Number, required: true },
    timeStepInSeconds: { type: Number },
    radius: { type: Number, required: true },
    targetCoords: coords,
    flightWay: [coords],
  },
  {
    timestamps: true,
    versionKey: false,
    id: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

PlaneSchema.virtual("id").get(function (this: any) {
  return this._id.toHexString();
});

// PlaneSchema.plugin(mongooseUniqueValidator);

export const PlaneModel = mongoose.model<PlaneDocument>("plane", PlaneSchema);
