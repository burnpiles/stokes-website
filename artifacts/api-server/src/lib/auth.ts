import type { Response, RequestHandler } from "express";

const COOKIE = "admin";
const MAX_AGE = 1000 * 60 * 60 * 24 * 7;

export function setAdminCookie(res: Response): void {
  res.cookie(COOKIE, "1", {
    signed: true,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export function clearAdminCookie(res: Response): void {
  res.clearCookie(COOKIE, { path: "/" });
}

export function isAdmin(signedCookies: Record<string, unknown> | undefined): boolean {
  return signedCookies?.[COOKIE] === "1";
}

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (isAdmin(req.signedCookies)) {
    next();
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
};
