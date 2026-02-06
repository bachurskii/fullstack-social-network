declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        subscription: string;
      };
      file?: Express.Request.Multer.File;
    }
  }
}

export {};
