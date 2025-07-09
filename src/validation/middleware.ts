import { Request, Response, NextFunction } from "express";
import { ValidateFunction } from "ajv";

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export const createValidationMiddleware = (validator: ValidateFunction) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const isValid = validator(req.body);

    if (!isValid) {
      const errors: ValidationError[] =
        validator.errors?.map((error) => ({
          field:
            error.instancePath.slice(1) ||
            error.params?.missingProperty ||
            "root",
          message: error.message || "Validation failed",
          value: error.data,
        })) || [];

      res.status(400).json({
        message: "Validation failed",
        errors: errors,
      });
      return;
    }

    next();
  };
};
