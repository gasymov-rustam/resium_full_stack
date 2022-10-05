import type { ErrorRequestHandler } from "express";
import { ApiError } from "../helpers/AppError";

// export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
//   const { name, errors, status, message } = err;

//   if (res.headersSent) {
//     return next(err);
//   }

//   if (name === "ValidationError") {
//     const status = Object.values(errors).find(({ kind }: any) => kind === "unique") ? 409 : 422;

//     res.status(status).json({
//       message: "Bad Request",
//       errors: Object.values(errors).reduce(
//         (errors: any, error: any) => ({
//           ...errors,
//           [error.path]: error.message,
//         }),
//         {}
//       ),
//     });
//   }

//   res.status(status || 500).send({ message });
// };

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err);
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }

  return res.status(500).json({ message: "Unexpected Error!!" });
};
