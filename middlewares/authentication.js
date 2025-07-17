import { validateToken } from "../service/authentication.js";

export function checkForAuthentiationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue); 
      req.user = userPayload; 
    } catch (error) {
      console.error("Invalid token:", error.message);
    }

    return next();
  };
}
