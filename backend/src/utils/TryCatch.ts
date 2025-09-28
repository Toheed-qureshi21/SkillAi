import { Request, Response } from "express";

export const TryCatch = (
  handlerFunction: (req: Request, res: Response) => Promise<any>
) => {
  return async (req: Request, res: Response) => {
    try {
      await handlerFunction(req, res);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Something went wrong" });
    }
  };
};
