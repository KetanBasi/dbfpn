import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // ============================================
    // ADMIN USERS - Add your admin emails here!
    // ============================================
    const adminEmails = [
        'admin@dbfpn.com',
        // Add more admin emails below:
        // 'youremail@example.com',
    ]

    for (const email of adminEmails) {
        const existing = await prisma.user.findUnique({ where: { email } })
        if (!existing) {
            await prisma.user.create({
                data: {
                    email,
                    role: 'admin',
                    status: 'active',
                    username: email.split('@')[0],
                },
            })
            console.log(`✅ Created admin: ${email}`)
        } else {
            // Update existing user to admin
            await prisma.user.update({
                where: { email },
                data: { role: 'admin' },
            })
            console.log(`🔄 Updated to admin: ${email}`)
        }
    }

    // ============================================
    // GENRES - Standard movie genres
    // ============================================
    const genres = [
        { name: 'Action', slug: 'action' },
        { name: 'Adventure', slug: 'adventure' },
        { name: 'Animation', slug: 'animation' },
        { name: 'Comedy', slug: 'comedy' },
        { name: 'Crime', slug: 'crime' },
        { name: 'Documentary', slug: 'documentary' },
        { name: 'Drama', slug: 'drama' },
        { name: 'Family', slug: 'family' },
        { name: 'Fantasy', slug: 'fantasy' },
        { name: 'Horror', slug: 'horror' },
        { name: 'Mystery', slug: 'mystery' },
        { name: 'Romance', slug: 'romance' },
        { name: 'Sci-Fi', slug: 'sci-fi' },
        { name: 'Thriller', slug: 'thriller' },
        { name: 'War', slug: 'war' },
        { name: 'Western', slug: 'western' },
    ]

    for (const genre of genres) {
        await prisma.genre.upsert({
            where: { slug: genre.slug },
            update: {},
            create: genre,
        })
    }
    console.log(`✅ Seeded ${genres.length} genres`)

    console.log('🎉 Database seed completed!')
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
