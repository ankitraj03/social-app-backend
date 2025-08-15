import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 15, // limit each IP to 5 requests per windowMs
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true, // send rate limit info in headers
  legacyHeaders: false,
});
