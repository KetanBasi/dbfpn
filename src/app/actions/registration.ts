"use server"

import prisma from "@/lib/prisma"
import nodemailer from "nodemailer"

// Generate a 6-digit OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

// Validate email format
function isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

// Create email transport
function createTransport() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
        },
    })
}

// OTP email HTML template
function otpEmailHtml(otp: string): string {
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
                            <h2 style="margin: 0 0 16px 0; color: ${textColor}; font-size: 24px; font-weight: 600;">Kode Verifikasi Anda</h2>
                            <p style="margin: 0 0 32px 0; color: #888; font-size: 14px;">
                                Masukkan kode berikut untuk menyelesaikan pendaftaran:
                            </p>
                            <div style="background-color: #252525; border-radius: 8px; padding: 24px; margin: 0 0 32px 0;">
                                <span style="font-size: 32px; font-weight: bold; color: ${brandColor}; letter-spacing: 8px;">${otp}</span>
                            </div>
                            <p style="margin: 0; color: #888; font-size: 14px; line-height: 1.6;">
                                Kode ini berlaku selama 10 menit.<br>
                                Jika Anda tidak meminta kode ini, abaikan email ini.
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

// OTP email plain text
function otpEmailText(otp: string): string {
    return `Kode verifikasi DBFPN Anda: ${otp}\n\nKode ini berlaku selama 10 menit.\nJika Anda tidak meminta kode ini, abaikan email ini.`
}

export async function initiateRegistration(email: string, callbackUrl?: string) {
    try {
        // Validate email format
        if (!isValidEmail(email)) {
            return { error: "Format email tidak valid" }
        }

        // Check if email already exists in User table
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            // Check if user has completed profile
            if (!existingUser.username || !existingUser.name) {
                return { error: "profile_incomplete", userId: existingUser.id }
            }
            return { error: "Email sudah terdaftar. Silakan masuk." }
        }

        // Delete any existing pending registration (revoke old OTP)
        await prisma.pendingRegistration.deleteMany({
            where: { email },
        })

        // Generate new OTP
        const otp = generateOTP()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        // Store pending registration
        await prisma.pendingRegistration.create({
            data: {
                email,
                otp,
                callbackUrl,
                expiresAt,
            },
        })

        // Send OTP via email
        const transport = createTransport()
        await transport.sendMail({
            to: email,
            from: `DBFPN <${process.env.EMAIL_FROM}>`,
            subject: "Kode Verifikasi DBFPN",
            text: otpEmailText(otp),
            html: otpEmailHtml(otp),
        })

        return { success: true }
    } catch (error) {
        console.error("Error initiating registration:", error)
        return { error: "Terjadi kesalahan. Silakan coba lagi." }
    }
}

export async function verifyOTP(email: string, otp: string) {
    try {
        // Find pending registration
        const pending = await prisma.pendingRegistration.findUnique({
            where: { email },
        })

        if (!pending) {
            return { error: "Tidak ada pendaftaran yang tertunda untuk email ini." }
        }

        // Check if OTP has expired
        if (new Date() > pending.expiresAt) {
            // Delete expired registration
            await prisma.pendingRegistration.delete({
                where: { email },
            })
            return { error: "Kode OTP sudah kadaluarsa. Silakan daftar ulang." }
        }

        // Check if OTP matches
        if (pending.otp !== otp) {
            return { error: "Kode OTP tidak valid." }
        }

        // Create user with email verified
        const user = await prisma.user.create({
            data: {
                email,
                emailVerified: new Date(),
            },
        })

        // Delete pending registration
        await prisma.pendingRegistration.delete({
            where: { email },
        })

        return {
            success: true,
            userId: user.id,
            callbackUrl: pending.callbackUrl
        }
    } catch (error) {
        console.error("Error verifying OTP:", error)
        return { error: "Terjadi kesalahan. Silakan coba lagi." }
    }
}

export async function resendOTP(email: string) {
    try {
        // Find pending registration
        const pending = await prisma.pendingRegistration.findUnique({
            where: { email },
        })

        if (!pending) {
            return { error: "Tidak ada pendaftaran yang tertunda untuk email ini." }
        }

        // Generate new OTP
        const otp = generateOTP()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        // Update pending registration
        await prisma.pendingRegistration.update({
            where: { email },
            data: {
                otp,
                expiresAt,
            },
        })

        // Send OTP via email
        const transport = createTransport()
        await transport.sendMail({
            to: email,
            from: `DBFPN <${process.env.EMAIL_FROM}>`,
            subject: "Kode Verifikasi DBFPN (Kirim Ulang)",
            text: otpEmailText(otp),
            html: otpEmailHtml(otp),
        })

        return { success: true }
    } catch (error) {
        console.error("Error resending OTP:", error)
        return { error: "Terjadi kesalahan. Silakan coba lagi." }
    }
}

export async function checkProfileCompletion(userId: number) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { username: true, name: true },
        })

        if (!user) {
            return { error: "User tidak ditemukan" }
        }

        return {
            complete: !!(user.username && user.name),
            username: user.username,
            name: user.name,
        }
    } catch (error) {
        console.error("Error checking profile completion:", error)
        return { error: "Terjadi kesalahan" }
    }
}
