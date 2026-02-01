import { HttpMiddleware } from "@effect/platform"

export const corsMiddleware = (origin: string) =>
  HttpMiddleware.cors({
    allowedOrigins: [origin],
    credentials: true,
    allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
