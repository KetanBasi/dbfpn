import nodemailer from "nodemailer"

// Helper that doesn't throw during build time
function getEnv(name: string, fallback?: string) {
  const v = process.env[name]
  if (v) return v
  if (fallback !== undefined) return fallback
  // Only throw at runtime when actually needed
  return ""
}

// Use the same env vars as the rest of the app
export const mailer = nodemailer.createTransport({
  host: getEnv("EMAIL_SERVER_HOST"),
  port: Number(getEnv("EMAIL_SERVER_PORT", "465")),
  secure: Number(getEnv("EMAIL_SERVER_PORT", "465")) === 465,
  auth: {
    user: getEnv("EMAIL_SERVER_USER"),
    pass: getEnv("EMAIL_SERVER_PASSWORD"),
  },
})

export const MAIL_FROM = getEnv("EMAIL_FROM")
export const APP_URL = getEnv("NEXTAUTH_URL", "http://localhost:8000")
export const APP_NAME = getEnv("APP_NAME", "DBFPN")
