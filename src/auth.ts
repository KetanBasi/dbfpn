import NextAuth from "next-auth"
import Nodemailer from "next-auth/providers/nodemailer"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { authConfig } from "./auth.config"
import nodemailer from "nodemailer"

// Custom adapter to handle integer IDs properly
function IntIdPrismaAdapter(p: typeof prisma) {
  const base = PrismaAdapter(p) as any

  return {
    ...base,

    async getUser(id: any) {
      if (!id) return null
      const numId = Number(id)
      if (!Number.isFinite(numId)) return null
      return p.user.findUnique({ where: { id: numId } })
    },

    async updateUser(user: any) {
      if (!user?.id) return null
      const numId = Number(user.id)
      return p.user.update({
        where: { id: numId },
        data: { ...user, id: undefined },
      })
    },

    async deleteUser(id: any) {
      if (!id) return null
      const numId = Number(id)
      return p.user.delete({ where: { id: numId } })
    },
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: IntIdPrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  debug: false,
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: `DBFPN <${process.env.EMAIL_FROM}>`,
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        const { host } = new URL(url)
        const transport = nodemailer.createTransport(provider.server)
        const result = await transport.sendMail({
          to: email,
          from: provider.from,
          subject: `Sign in to DBFPN`,
          text: text({ url, host }),
          html: html({ url, host, email }),
        })
        const failed = result.rejected.concat(result.pending).filter(Boolean)
        if (failed.length) {
          throw new Error(`Email (${failed.join(", ")}) could not be sent`)
        }
      },
    }),
  ],
})

function html(params: { url: string; host: string; email: string }) {
  const { url } = params
  const brandColor = "#FFEB3B"
  const backgroundColor = "#0a0a0a"
  const textColor = "#ffffff"

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: ${backgroundColor};">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${backgroundColor}; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1a1a1a; border-radius: 12px; overflow: hidden; border: 1px solid #333;">
                    <tr>
                        <td style="padding: 40px; text-align: center;">
                            <h1 style="margin: 0 0 24px 0; color: ${brandColor}; font-size: 32px; font-weight: bold;">DBFPN</h1>
                            <h2 style="margin: 0 0 32px 0; color: ${textColor}; font-size: 24px; font-weight: 600;">Sign in to DBFPN</h2>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 0;">
                                        <a href="${url}" target="_blank" style="display: inline-block; background-color: ${brandColor}; color: #000000; text-decoration: none; font-weight: bold; padding: 16px 48px; border-radius: 8px; font-size: 16px;">Sign in</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 32px 0 0 0; color: #888; font-size: 14px; line-height: 1.6;">
                                If you did not request this email you can safely ignore it.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`
}

function text({ url, host }: { url: string; host: string }) {
  return `Sign in to DBFPN\n\n${url}\n\n`
}
