import type { NextFunction, Request, RequestHandler, Response } from "express"

/**
 * Express 4 does not catch rejected promises from async handlers — they become
 * unhandled rejections and kill the process. Wrap every async route with this
 * so thrown `ApiError`s reach the error middleware in `index.ts`.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}
