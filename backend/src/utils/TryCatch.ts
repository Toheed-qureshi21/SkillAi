import { Request, Response } from "express";

export const TryCatch = (
  handlerFunction: (req: Request, res: Response) => Promise<any>
) => {
  return async (req: Request, res: Response) => {
    try {
      await handlerFunction(req, res);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null) {
        const { status, statusCode, publicMessage } = error as {
          status?: number;
          statusCode?: number;
          publicMessage?: string;
        };
        console.log("Server error is ",error)
        if (status ?? statusCode) {
          return res
            .status(status ?? statusCode!)
            .json({ message: publicMessage ?? "Request failed" });
        }
      }
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
