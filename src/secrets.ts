import dotenv from "dotenv"
dotenv.config({ path: ".env" })

export const PORT = process.env.PORT
export const JWT_SECRET = process.env.JWT_SECRET
export const EMAIL_USER = process.env.EMAIL_USER
export const EMAIL_PASS = process.env.EMAIL_PASS
export const SMTP_HOST = process.env.SMTP_HOST
export const SMTP_PORT = process.env.SMTP_PORT
export const BASE_URL = process.env.BASE_URL

export const CLOUDCUBE_ACCESS_KEY_ID = process.env.CLOUDCUBE_ACCESS_KEY_ID
export const CLOUDCUBE_SECRET_ACCESS_KEY = process.env.CLOUDCUBE_SECRET_ACCESS_KEY
export const CLOUDCUBE_URL = process.env.CLOUDCUBE_URL


export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
export const CLOUD_NAME = process.env.CLOUD_NAME