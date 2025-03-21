import dotenv from "dotenv"
dotenv.config({ path: ".env" })

export const PORT = process.env.PORT
export const JWT_SECRET = process.env.JWT_SECRET
export const EMAIL_USER = process.env.EMAIL_USER
export const EMAIL_PASS = process.env.EMAIL_PASS
export const SMTP_HOST = process.env.SMTP_HOST
export const SMTP_PORT = process.env.SMTP_PORT
export const BASE_URL = process.env.BASE_URL