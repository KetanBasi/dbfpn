-- Clear existing data (optional, be careful in production)
TRUNCATE TABLE users, accounts, sessions, movies, genres, movie_genres, people, movie_people, reviews, comments, watchlist, reports, notifications, audit_logs RESTART IDENTITY CASCADE;

-- 1. Users (Removed password_hash, added email_verified)
INSERT INTO users ("name", username, email, role, avatar_url, bio, status, email_verified) VALUES
('Admin User', 'admin', 'admin@dbfpn.com', 			'admin', 'https://placehold.co/150x150/red/white.png?text=Admin', 'Administrator of DBFPN', 'active', NOW()),
('Ketan', 	 'ketan', 	'fatanaqilla90@gmail.com',	'admin', 'https://placehold.co/150x150/red/white.png?text=KTN', 'Actual Human Administrator of DBFPN', 'active', NOW()),
('John Doe', 'johndoe', 'john@example.com',			'user', 'https://placehold.co/150x150/blue/white.png?text=JD', 'Movie enthusiast', 'active', NOW()),
('Jane Doe', 'janedoe', 'jane@example.com',			'user', 'https://placehold.co/150x150/green/white.png?text=Jane', 'Love horror movies', 'active', NOW()),
('Banned User', 'banned_user', 'banned@example.com', 'user', NULL, 'I was naughty', 'banned', NOW());

-- 2. Genres
INSERT INTO genres ("name", slug) VALUES
('Action', 'action'),
('Drama', 'drama'),
('Horror', 'horror'),
('Comedy', 'comedy'),
('Sci-Fi', 'sci-fi'),
('Thriller', 'thriller'),
('Romance', 'romance'),
('Documentary', 'documentary');

-- 3. People (Directors, Actors)
INSERT INTO people ("name", slug, image_url, bio, birth_date) VALUES
('Christopher Nolan', 'christopher-nolan', 'https://placehold.co/200x300/252525/white.png?text=CN', 'British-American film director.', '1970-07-30'),
('Leonardo DiCaprio', 'leonardo-dicaprio', 'https://placehold.co/200x300/252525/white.png?text=Leo', 'American actor and film producer.', '1974-11-11'),
('Joseph Gordon-Levitt', 'joseph-gordon-levitt', 'https://placehold.co/200x300/252525/white.png?text=JGL', 'American actor.', '1981-02-17'),
('Greta Gerwig', 'greta-gerwig', 'https://placehold.co/200x300/252525/white.png?text=GG', 'American director and actress.', '1983-08-04'),
('Margot Robbie', 'margot-robbie', 'https://placehold.co/200x300/252525/white.png?text=Margot', 'Australian actress.', '1990-07-02');

-- 4. Movies
INSERT INTO movies (title, slug, synopsis, release_date, duration, poster_url, banner_url, trailer_url, status, submitter_id) VALUES
('Inception', 'inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', '2010-07-16', 148, 'https://placehold.co/600x900/252525/white.png?text=Inception', 'https://placehold.co/1920x1080/252525/white.png?text=Inception+Banner', 'https://www.youtube.com/watch?v=YoHD9XEInc0', 'approved', 1),
('Barbie', 'barbie', 'Barbie suffers a crisis that leads her to question her world and her existence.', '2023-07-21', 114, 'https://placehold.co/600x900/ff69b4/white.png?text=Barbie', 'https://placehold.co/1920x1080/ff69b4/white.png?text=Barbie+Banner', 'https://www.youtube.com/watch?v=pBk4NYhWNMM', 'approved', 2),
('Pending Movie', 'pending-movie', 'A movie waiting for approval.', '2025-01-01', 90, 'https://placehold.co/600x900/gray/white.png?text=Pending', NULL, NULL, 'pending', 2);

-- 5. Movie Genres
INSERT INTO movie_genres (movie_id, genre_id) VALUES
(1, 1), -- Inception -> Action
(1, 5), -- Inception -> Sci-Fi
(1, 6), -- Inception -> Thriller
(2, 4), -- Barbie -> Comedy
(2, 7); -- Barbie -> Romance

-- 6. Movie People
INSERT INTO movie_people (movie_id, person_id, role, character_name) VALUES
(1, 1, 'director', NULL), -- Nolan directed Inception
(1, 2, 'cast', 'Cobb'), -- Leo in Inception
(1, 3, 'cast', 'Arthur'), -- JGL in Inception
(2, 4, 'director', NULL), -- Greta directed Barbie
(2, 5, 'cast', 'Barbie'); -- Margot in Barbie

-- 7. Reviews
INSERT INTO reviews (user_id, movie_id, rating, content) VALUES
(2, 1, 10, 'Masterpiece! Nolan did it again.'),
(3, 1, 9, 'Mind-bending and visually stunning.'),
(1, 2, 8, 'Surprisingly deep for a doll movie.');

-- 8. Comments
INSERT INTO comments (user_id, movie_id, content, parent_id) VALUES
(2, 1, 'Does the top fall at the end?', NULL),
(3, 1, 'I think it does!', 1); -- Reply to comment 1

-- 9. Watchlist
INSERT INTO watchlist (user_id, movie_id) VALUES
(2, 2), -- John wants to watch Barbie
(3, 2); -- Jane wants to watch Barbie

-- 10. Notifications
INSERT INTO notifications (user_id, type, title, message, is_read) VALUES
(2, 'movie_approved', 'Movie Approved', 'Your submission "Barbie" has been approved.', false),
(2, 'comment_reply', 'New Reply', 'JaneDoe replied to your comment on Inception.', false);

-- 11. Reports
INSERT INTO reports (reporter_id, target_type, target_id, reason, status) VALUES
(3, 'user', 4, 'Spamming comments', 'pending');

-- 12. Audit Logs
INSERT INTO audit_logs (admin_id, action, target_type, target_id, details) VALUES
(1, 'approve_movie', 'movie', 1, '{"reason": "Meets all guidelines"}'),
(1, 'approve_movie', 'movie', 2, '{"reason": "Great submission"}');
