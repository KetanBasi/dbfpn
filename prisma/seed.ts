import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // ============================================
    // ADMIN USERS - Add your admin emails here!
    // ============================================
    const adminEmails = [
        'admin@dbfpn.com',
        'fatanaqilla90@gmail.com',
        'enkadhe30@gmail.com',
        'imranzulkarnaen46@gmail.com',
        'farihinmuhamad@gmail.com',
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

    // ============================================
    // GET SUBMITTER - Use second admin as movie submitter
    // ============================================
    const submitterEmail = adminEmails[1] // fatanaqilla90@gmail.com
    const submitter = await prisma.user.findUnique({ where: { email: submitterEmail } })
    if (!submitter) {
        console.error(`❌ Submitter not found: ${submitterEmail}`)
        return
    }
    console.log(`📽️ Using submitter for movies: ${submitterEmail}`)

    // ============================================
    // SAMPLE SHORT MOVIES - Different submission statuses
    // ============================================
    const sampleMovies = [
        {
            title: 'Cahaya Senja',
            slug: 'cahaya-senja',
            synopsis: 'Seorang fotografer muda kembali ke rumah neneknya di pedesaan setelah menerima kabar kepergiannya. Saat memilah foto-foto lama dan kenangan, ia menemukan sepucuk surat tersembunyi yang mengungkap rahasia keluarga tentang masa lalu kakeknya selama perang.',
            releaseDate: new Date('2024-06-15'),
            duration: 28,
            status: 'approved',
            genres: ['drama', 'family'],
        },
        {
            title: 'Man vs Baby',
            slug: 'man-vs-baby',
            synopsis: 'Seorang ayah muda yang kikuk harus menjaga bayinya sendirian untuk pertama kalinya ketika istrinya pergi ke luar kota. Serangkaian kejadian kocak terjadi saat ia berjuang memahami tangisan, mengganti popok, dan memasak bubur bayi, sambil menyadari bahwa menjadi ayah jauh lebih sulit dari yang ia bayangkan.',
            releaseDate: new Date('2024-07-20'),
            duration: 18,
            status: 'approved',
            genres: ['comedy', 'family'],
        },
        {
            title: 'Perjalanan Terakhir',
            slug: 'perjalanan-terakhir',
            synopsis: 'Dua orang kakak beradik yang sudah lama terpisah berbagi perjalanan taksi yang canggung dari bandara setelah pemakaman ayah mereka. Melalui percakapan yang terputus-putus dan keheningan yang menyakitkan, mereka menghadapi ketegangan yang tak terselesaikan yang telah memisahkan mereka selama lebih dari satu dekade.',
            releaseDate: new Date('2024-03-22'),
            duration: 35,
            status: 'rejected',
            genres: ['drama'],
        },
        {
            title: 'Gema di Dapur',
            slug: 'gema-di-dapur',
            synopsis: 'Seorang koki pensiunan yang kehilangan indera perasanya berusaha membuat ulang masakan khas mendiang istrinya untuk peringatan pernikahan mereka. Apa yang dimulai sebagai tantangan kuliner berubah menjadi perjalanan mengharukan melewati kenangan puluhan tahun bersama.',
            releaseDate: new Date('2024-08-10'),
            duration: 22,
            status: 'pending', // Requires revision
            genres: ['drama', 'romance'],
        },
        {
            title: 'Mimpi Biner',
            slug: 'mimpi-biner',
            synopsis: 'Di Jakarta masa depan, seorang programmer muda menciptakan AI untuk membantunya melewati kesedihan setelah kehilangan sahabatnya. Namun ketika AI mulai menunjukkan perilaku dan ingatan yang tak terduga, ia harus menghadapi pertanyaan apakah teknologi benar-benar bisa menangkap esensi hubungan manusia.',
            releaseDate: new Date('2024-09-05'),
            duration: 38,
            status: 'rejected',
            genres: ['sci-fi', 'drama'],
        },
    ]

    const approvedMovies: { id: number; title: string }[] = []

    for (const movieData of sampleMovies) {
        const existingMovie = await prisma.movie.findUnique({ where: { slug: movieData.slug } })

        if (!existingMovie) {
            const movie = await prisma.movie.create({
                data: {
                    title: movieData.title,
                    slug: movieData.slug,
                    synopsis: movieData.synopsis,
                    releaseDate: movieData.releaseDate,
                    duration: movieData.duration,
                    status: movieData.status,
                    submitterId: submitter.id,
                },
            })

            // Connect genres
            for (const genreSlug of movieData.genres) {
                const genre = await prisma.genre.findUnique({ where: { slug: genreSlug } })
                if (genre) {
                    await prisma.movieGenre.create({
                        data: {
                            movieId: movie.id,
                            genreId: genre.id,
                        },
                    })
                }
            }

            // Track approved movies for reviews
            if (movieData.status === 'approved') {
                approvedMovies.push({ id: movie.id, title: movieData.title })
            }

            console.log(`✅ Created movie: ${movieData.title} (${movieData.status})`)
        } else {
            // Track existing approved movies for reviews
            if (movieData.status === 'approved') {
                approvedMovies.push({ id: existingMovie.id, title: existingMovie.title })
            }
            console.log(`🔄 Movie already exists: ${movieData.title}`)
        }
    }

    // ============================================
    // REVIEWER USERS - For sample reviews
    // ============================================
    const reviewerEmails = [
        { email: 'reviewer1@dbfpn.com', username: 'cinephile_id', name: 'Budi Santoso' },
        { email: 'reviewer2@dbfpn.com', username: 'filmkritik', name: 'Sari Wijaya' },
        { email: 'reviewer3@dbfpn.com', username: 'moviebuff', name: 'Andi Pratama' },
    ]

    const reviewers: { id: number; name: string }[] = []
    for (const reviewerData of reviewerEmails) {
        let reviewer = await prisma.user.findUnique({ where: { email: reviewerData.email } })
        if (!reviewer) {
            reviewer = await prisma.user.create({
                data: {
                    email: reviewerData.email,
                    username: reviewerData.username,
                    name: reviewerData.name,
                    role: 'user',
                    status: 'active',
                },
            })
            console.log(`✅ Created reviewer: ${reviewerData.name}`)
        }
        reviewers.push({ id: reviewer.id, name: reviewer.name || reviewerData.name })
    }

    // ============================================
    // SAMPLE REVIEWS - For approved movies (1-5 scale)
    // ============================================
    const sampleReviews = [
        // Reviews for Cahaya Senja
        { movieTitle: 'Cahaya Senja', reviewerIndex: 0, rating: 5, content: 'Film pendek yang sangat menyentuh hati. Sinematografi indah dan akting yang natural membuat cerita tentang keluarga ini terasa sangat nyata.' },
        { movieTitle: 'Cahaya Senja', reviewerIndex: 1, rating: 4, content: 'Penceritaan yang kuat dengan twist yang tidak terduga. Sedikit lambat di awal tapi worth it sampai akhir.' },
        { movieTitle: 'Cahaya Senja', reviewerIndex: 2, rating: 4, content: null }, // Rating only, no comment

        // Reviews for Man vs Baby
        { movieTitle: 'Man vs Baby', reviewerIndex: 0, rating: 5, content: 'Lucu banget! Relatable buat para ayah baru. Komedi yang wholesome dan menghangatkan hati.' },
        { movieTitle: 'Man vs Baby', reviewerIndex: 1, rating: 3, content: null }, // Rating only, no comment
        { movieTitle: 'Man vs Baby', reviewerIndex: 2, rating: 4, content: 'Chemistry antara aktor utama dan bayi-nya luar biasa. Tertawa dari awal sampai akhir!' },
    ]

    for (const reviewData of sampleReviews) {
        const movie = approvedMovies.find(m => m.title === reviewData.movieTitle)
        if (!movie) continue

        const reviewer = reviewers[reviewData.reviewerIndex]

        // Check if review already exists
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_movieId: {
                    userId: reviewer.id,
                    movieId: movie.id,
                },
            },
        })

        if (!existingReview) {
            await prisma.review.create({
                data: {
                    userId: reviewer.id,
                    movieId: movie.id,
                    rating: reviewData.rating,
                    content: reviewData.content,
                },
            })
            console.log(`✅ Created review: ${reviewer.name} → ${movie.title} (${reviewData.rating}/5${reviewData.content ? ' with comment' : ''})`)
        }
    }

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
