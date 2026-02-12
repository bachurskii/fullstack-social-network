import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

const validateBody = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
      return;
    }
    next();
  };
};

export default validateBody;
