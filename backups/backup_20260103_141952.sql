--
-- PostgreSQL database dump
--

\restrict S2J8sWef60fcLoTAxdhiWZ6hgjHphkb6gObn8tyf9egEt3WLAG6jqgZ0ZFZTvbW

-- Dumped from database version 17.7
-- Dumped by pg_dump version 18.1 (Ubuntu 18.1-1.pgdg22.04+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: avnadmin
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO avnadmin;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: avnadmin
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.accounts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    provider_account_id text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public.accounts OWNER TO avnadmin;

--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accounts_id_seq OWNER TO avnadmin;

--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    admin_id integer,
    action text NOT NULL,
    target_type text NOT NULL,
    target_id integer NOT NULL,
    details jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO avnadmin;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO avnadmin;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: comment_votes; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.comment_votes (
    user_id integer NOT NULL,
    comment_id integer NOT NULL,
    is_dislike boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.comment_votes OWNER TO avnadmin;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    user_id integer NOT NULL,
    movie_id integer NOT NULL,
    content text NOT NULL,
    parent_id integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone,
    deleted_at timestamp(3) without time zone
);


ALTER TABLE public.comments OWNER TO avnadmin;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO avnadmin;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- Name: genres; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.genres (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL
);


ALTER TABLE public.genres OWNER TO avnadmin;

--
-- Name: genres_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.genres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.genres_id_seq OWNER TO avnadmin;

--
-- Name: genres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.genres_id_seq OWNED BY public.genres.id;


--
-- Name: movie_genres; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.movie_genres (
    movie_id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.movie_genres OWNER TO avnadmin;

--
-- Name: movie_people; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.movie_people (
    movie_id integer NOT NULL,
    person_id integer NOT NULL,
    role text NOT NULL,
    character_name text
);


ALTER TABLE public.movie_people OWNER TO avnadmin;

--
-- Name: movies; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.movies (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    synopsis text,
    release_date date,
    duration integer,
    poster_url text,
    banner_url text,
    trailer_url text,
    status text DEFAULT 'pending'::text NOT NULL,
    submitter_id integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone,
    video_url text
);


ALTER TABLE public.movies OWNER TO avnadmin;

--
-- Name: movies_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.movies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movies_id_seq OWNER TO avnadmin;

--
-- Name: movies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.movies_id_seq OWNED BY public.movies.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text,
    is_read boolean DEFAULT false NOT NULL,
    link text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.notifications OWNER TO avnadmin;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO avnadmin;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: pending_registrations; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.pending_registrations (
    id integer NOT NULL,
    email text NOT NULL,
    otp text NOT NULL,
    callback_url text,
    expires_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.pending_registrations OWNER TO avnadmin;

--
-- Name: pending_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.pending_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pending_registrations_id_seq OWNER TO avnadmin;

--
-- Name: pending_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.pending_registrations_id_seq OWNED BY public.pending_registrations.id;


--
-- Name: people; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.people (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    image_url text,
    bio text,
    birth_date date,
    user_id integer
);


ALTER TABLE public.people OWNER TO avnadmin;

--
-- Name: people_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.people_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.people_id_seq OWNER TO avnadmin;

--
-- Name: people_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.people_id_seq OWNED BY public.people.id;


--
-- Name: reports; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.reports (
    id integer NOT NULL,
    reporter_id integer,
    target_type text NOT NULL,
    target_id integer NOT NULL,
    reason text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.reports OWNER TO avnadmin;

--
-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_id_seq OWNER TO avnadmin;

--
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;


--
-- Name: review_votes; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.review_votes (
    user_id integer NOT NULL,
    review_id integer NOT NULL,
    is_agree boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.review_votes OWNER TO avnadmin;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer NOT NULL,
    movie_id integer NOT NULL,
    rating integer NOT NULL,
    content text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone
);


ALTER TABLE public.reviews OWNER TO avnadmin;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO avnadmin;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    session_token text NOT NULL,
    user_id integer NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.sessions OWNER TO avnadmin;

--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sessions_id_seq OWNER TO avnadmin;

--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text,
    username text,
    email text NOT NULL,
    email_verified timestamp(3) without time zone,
    role text DEFAULT 'user'::text NOT NULL,
    avatar_url text,
    bio text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    social_links jsonb
);


ALTER TABLE public.users OWNER TO avnadmin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: avnadmin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO avnadmin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: avnadmin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: verification_tokens; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.verification_tokens (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.verification_tokens OWNER TO avnadmin;

--
-- Name: watchlist; Type: TABLE; Schema: public; Owner: avnadmin
--

CREATE TABLE public.watchlist (
    user_id integer NOT NULL,
    movie_id integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.watchlist OWNER TO avnadmin;

--
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- Name: genres id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.genres ALTER COLUMN id SET DEFAULT nextval('public.genres_id_seq'::regclass);


--
-- Name: movies id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.movies ALTER COLUMN id SET DEFAULT nextval('public.movies_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: pending_registrations id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.pending_registrations ALTER COLUMN id SET DEFAULT nextval('public.pending_registrations_id_seq'::regclass);


--
-- Name: people id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.people ALTER COLUMN id SET DEFAULT nextval('public.people_id_seq'::regclass);


--
-- Name: reports id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.accounts (id, user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.audit_logs (id, admin_id, action, target_type, target_id, details, created_at) FROM stdin;
\.


--
-- Data for Name: comment_votes; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.comment_votes (user_id, comment_id, is_dislike, created_at) FROM stdin;
2	1	f	2026-01-03 03:42:35.516
9	2	f	2026-01-03 03:43:01.703
\.


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.comments (id, user_id, movie_id, content, parent_id, created_at, updated_at, deleted_at) FROM stdin;
1	9	2	BBBean 🗿	\N	2026-01-03 03:25:11.867	2026-01-03 03:25:11.867	\N
2	2	2	NUT.	1	2026-01-03 03:42:16.249	2026-01-03 03:42:16.249	\N
\.


--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.genres (id, name, slug) FROM stdin;
1	Action	action
2	Adventure	adventure
3	Animation	animation
4	Comedy	comedy
5	Crime	crime
6	Documentary	documentary
7	Drama	drama
8	Family	family
9	Fantasy	fantasy
10	Horror	horror
11	Mystery	mystery
12	Romance	romance
13	Sci-Fi	sci-fi
14	Thriller	thriller
15	War	war
16	Western	western
\.


--
-- Data for Name: movie_genres; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.movie_genres (movie_id, genre_id) FROM stdin;
1	7
1	8
2	4
2	8
3	7
4	7
4	12
5	13
5	7
\.


--
-- Data for Name: movie_people; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.movie_people (movie_id, person_id, role, character_name) FROM stdin;
2	7	director	\N
2	8	writer	\N
2	9	cast	Trevor Bingley
2	10	cast	Jess
2	12	cast	Maddy
2	11	cast	Diana
\.


--
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.movies (id, title, slug, synopsis, release_date, duration, poster_url, banner_url, trailer_url, status, submitter_id, created_at, updated_at, video_url) FROM stdin;
1	Cahaya Senja	cahaya-senja	Seorang fotografer muda kembali ke rumah neneknya di pedesaan setelah menerima kabar kepergiannya. Saat memilah foto-foto lama dan kenangan, ia menemukan sepucuk surat tersembunyi yang mengungkap rahasia keluarga tentang masa lalu kakeknya selama perang.	2024-06-15	28	\N	\N	\N	approved	2	2025-12-31 04:08:14.421	2025-12-31 04:08:14.421	\N
3	Perjalanan Terakhir	perjalanan-terakhir	Dua orang kakak beradik yang sudah lama terpisah berbagi perjalanan taksi yang canggung dari bandara setelah pemakaman ayah mereka. Melalui percakapan yang terputus-putus dan keheningan yang menyakitkan, mereka menghadapi ketegangan yang tak terselesaikan yang telah memisahkan mereka selama lebih dari satu dekade.	2024-03-22	35	\N	\N	\N	rejected	2	2025-12-31 04:08:14.796	2025-12-31 04:08:14.796	\N
4	Gema di Dapur	gema-di-dapur	Seorang koki pensiunan yang kehilangan indera perasanya berusaha membuat ulang masakan khas mendiang istrinya untuk peringatan pernikahan mereka. Apa yang dimulai sebagai tantangan kuliner berubah menjadi perjalanan mengharukan melewati kenangan puluhan tahun bersama.	2024-08-10	22	\N	\N	\N	pending	2	2025-12-31 04:08:14.901	2025-12-31 04:08:14.901	\N
5	Mimpi Biner	mimpi-biner	Di Jakarta masa depan, seorang programmer muda menciptakan AI untuk membantunya melewati kesedihan setelah kehilangan sahabatnya. Namun ketika AI mulai menunjukkan perilaku dan ingatan yang tak terduga, ia harus menghadapi pertanyaan apakah teknologi benar-benar bisa menangkap esensi hubungan manusia.	2024-09-05	38	\N	\N	\N	rejected	2	2025-12-31 04:08:15.045	2025-12-31 04:08:15.045	\N
2	Man vs Baby	man-vs-baby	Seorang ayah muda yang kikuk harus menjaga bayinya sendirian untuk pertama kalinya ketika istrinya pergi ke luar kota. Serangkaian kejadian kocak terjadi saat ia berjuang memahami tangisan, mengganti popok, dan memasak bubur bayi, sambil menyadari bahwa menjadi ayah jauh lebih sulit dari yang ia bayangkan.	2025-12-16	30	https://upload.wikimedia.org/wikipedia/en/thumb/9/94/Man_vs._Baby_poster.jpg/250px-Man_vs._Baby_poster.jpg	https://i.ytimg.com/vi/enuQxUWTiP4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD5H_1yTZyNWE-AHMnhOMFvos7bfQ	https://www.youtube.com/watch?v=zHhR3daI3bY	approved	2	2025-12-31 04:08:14.653	2026-01-02 20:16:58.938	https://www.netflix.com/title/81923753
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.notifications (id, user_id, type, title, message, is_read, link, created_at) FROM stdin;
\.


--
-- Data for Name: pending_registrations; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.pending_registrations (id, email, otp, callback_url, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: people; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.people (id, name, slug, image_url, bio, birth_date, user_id) FROM stdin;
1	David Kerr	david-kerr-1767384859564	\N	\N	\N	\N
2	Rowan Atkinson	rowan-atkinson-1767384859682	\N	\N	\N	\N
3	Rowan Atkinson	rowan-atkinson-1767384859862	\N	\N	\N	\N
4	Claudie Blakley	claudie-blakley-1767384859862	\N	\N	\N	\N
5	Nina Sosanya	nina-sosanya-1767384859863	\N	\N	\N	\N
6	Alanah Bloor	alanah-bloor-1767384859863	\N	\N	\N	\N
7	David Kerr	david-kerr-1767384950604	\N	\N	\N	\N
8	Rowan Atkinson	rowan-atkinson-1767384950989	\N	\N	\N	\N
9	Rowan Atkinson	rowan-atkinson-1767384951216	\N	\N	\N	\N
10	Claudie Blakley	claudie-blakley-1767384951216	\N	\N	\N	\N
11	Nina Sosanya	nina-sosanya-1767384951216	\N	\N	\N	\N
12	Alanah Bloor	alanah-bloor-1767384951216	\N	\N	\N	\N
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.reports (id, reporter_id, target_type, target_id, reason, status, created_at) FROM stdin;
\.


--
-- Data for Name: review_votes; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.review_votes (user_id, review_id, is_agree, created_at) FROM stdin;
2	4	t	2026-01-03 06:40:19.94
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.reviews (id, user_id, movie_id, rating, content, created_at, updated_at) FROM stdin;
1	6	1	5	Film pendek yang sangat menyentuh hati. Sinematografi indah dan akting yang natural membuat cerita tentang keluarga ini terasa sangat nyata.	2025-12-31 04:08:15.386	2025-12-31 04:08:15.386
2	7	1	4	Penceritaan yang kuat dengan twist yang tidak terduga. Sedikit lambat di awal tapi worth it sampai akhir.	2025-12-31 04:08:15.454	2025-12-31 04:08:15.454
3	8	1	4	\N	2025-12-31 04:08:15.501	2025-12-31 04:08:15.501
4	6	2	5	Lucu banget! Relatable buat para ayah baru. Komedi yang wholesome dan menghangatkan hati.	2025-12-31 04:08:15.55	2025-12-31 04:08:15.55
5	7	2	3	\N	2025-12-31 04:08:15.617	2025-12-31 04:08:15.617
6	8	2	4	Chemistry antara aktor utama dan bayi-nya luar biasa. Tertawa dari awal sampai akhir!	2025-12-31 04:08:15.663	2025-12-31 04:08:15.663
7	2	2	5	Kacang 🥜	2026-01-03 06:48:30.783	2026-01-03 06:48:30.783
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.sessions (id, session_token, user_id, expires) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.users (id, name, username, email, email_verified, role, avatar_url, bio, created_at, status, social_links) FROM stdin;
1	\N	admin	admin@dbfpn.com	\N	admin	\N	\N	2025-12-30 12:37:57.764	active	\N
3	\N	enkadhe30	enkadhe30@gmail.com	\N	admin	\N	\N	2025-12-30 12:37:57.881	active	\N
4	\N	imranzulkarnaen46	imranzulkarnaen46@gmail.com	\N	admin	\N	\N	2025-12-30 12:37:57.929	active	\N
5	\N	farihinmuhamad	farihinmuhamad@gmail.com	\N	admin	\N	\N	2025-12-30 12:37:57.977	active	\N
6	Budi Santoso	cinephile_id	reviewer1@dbfpn.com	\N	user	\N	\N	2025-12-31 04:08:15.192	active	\N
7	Sari Wijaya	filmkritik	reviewer2@dbfpn.com	\N	user	\N	\N	2025-12-31 04:08:15.262	active	\N
8	Andi Pratama	moviebuff	reviewer3@dbfpn.com	\N	user	\N	\N	2025-12-31 04:08:15.316	active	\N
9	The Ketan Mk. II	the_ketan_mk2	fatanaqilla90+dbfpn001@gmail.com	2026-01-03 01:56:14.864	user	\N	\N	2026-01-02 14:58:47.996	active	\N
2	The Ketan	ketanbasi	fatanaqilla90@gmail.com	\N	admin	\N		2025-12-30 12:37:57.835	active	{"twitter": "", "instagram": ""}
\.


--
-- Data for Name: verification_tokens; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.verification_tokens (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: watchlist; Type: TABLE DATA; Schema: public; Owner: avnadmin
--

COPY public.watchlist (user_id, movie_id, created_at) FROM stdin;
\.


--
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.accounts_id_seq', 1, false);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, false);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.comments_id_seq', 2, true);


--
-- Name: genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.genres_id_seq', 16, true);


--
-- Name: movies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.movies_id_seq', 5, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: pending_registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.pending_registrations_id_seq', 1, false);


--
-- Name: people_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.people_id_seq', 12, true);


--
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.reports_id_seq', 1, false);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.reviews_id_seq', 7, true);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.sessions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: avnadmin
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: comment_votes comment_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.comment_votes
    ADD CONSTRAINT comment_votes_pkey PRIMARY KEY (user_id, comment_id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- Name: movie_genres movie_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_pkey PRIMARY KEY (movie_id, genre_id);


--
-- Name: movie_people movie_people_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.movie_people
    ADD CONSTRAINT movie_people_pkey PRIMARY KEY (movie_id, person_id, role);


--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: pending_registrations pending_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.pending_registrations
    ADD CONSTRAINT pending_registrations_pkey PRIMARY KEY (id);


--
-- Name: people people_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_pkey PRIMARY KEY (id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: review_votes review_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.review_votes
    ADD CONSTRAINT review_votes_pkey PRIMARY KEY (user_id, review_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: watchlist watchlist_pkey; Type: CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_pkey PRIMARY KEY (user_id, movie_id);


--
-- Name: accounts_provider_provider_account_id_key; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE UNIQUE INDEX accounts_provider_provider_account_id_key ON public.accounts USING btree (provider, provider_account_id);


--
-- Name: accounts_user_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX accounts_user_id_idx ON public.accounts USING btree (user_id);


--
-- Name: audit_logs_action_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX audit_logs_action_idx ON public.audit_logs USING btree (action);


--
-- Name: audit_logs_admin_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX audit_logs_admin_id_idx ON public.audit_logs USING btree (admin_id);


--
-- Name: audit_logs_created_at_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX audit_logs_created_at_idx ON public.audit_logs USING btree (created_at);


--
-- Name: audit_logs_target_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX audit_logs_target_id_idx ON public.audit_logs USING btree (target_id);


--
-- Name: audit_logs_target_type_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX audit_logs_target_type_idx ON public.audit_logs USING btree (target_type);


--
-- Name: comment_votes_comment_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX comment_votes_comment_id_idx ON public.comment_votes USING btree (comment_id);


--
-- Name: comments_created_at_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX comments_created_at_idx ON public.comments USING btree (created_at);


--
-- Name: comments_movie_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX comments_movie_id_idx ON public.comments USING btree (movie_id);


--
-- Name: comments_parent_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX comments_parent_id_idx ON public.comments USING btree (parent_id);


--
-- Name: comments_user_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX comments_user_id_idx ON public.comments USING btree (user_id);


--
-- Name: genres_name_key; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE UNIQUE INDEX genres_name_key ON public.genres USING btree (name);


--
-- Name: genres_slug_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX genres_slug_idx ON public.genres USING btree (slug);


--
-- Name: genres_slug_key; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE UNIQUE INDEX genres_slug_key ON public.genres USING btree (slug);


--
-- Name: movie_genres_genre_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX movie_genres_genre_id_idx ON public.movie_genres USING btree (genre_id);


--
-- Name: movie_genres_movie_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX movie_genres_movie_id_idx ON public.movie_genres USING btree (movie_id);


--
-- Name: movie_people_movie_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX movie_people_movie_id_idx ON public.movie_people USING btree (movie_id);


--
-- Name: movie_people_person_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX movie_people_person_id_idx ON public.movie_people USING btree (person_id);


--
-- Name: movie_people_role_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX movie_people_role_idx ON public.movie_people USING btree (role);


--
-- Name: movies_created_at_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX movies_created_at_idx ON public.movies USING btree (created_at);


--
-- Name: movies_release_date_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX movies_release_date_idx ON public.movies USING btree (release_date);


--
-- Name: movies_slug_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX movies_slug_idx ON public.movies USING btree (slug);


--
-- Name: movies_slug_key; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE UNIQUE INDEX movies_slug_key ON public.movies USING btree (slug);


--
-- Name: movies_status_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX movies_status_idx ON public.movies USING btree (status);


--
-- Name: movies_submitter_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX movies_submitter_id_idx ON public.movies USING btree (submitter_id);


--
-- Name: notifications_created_at_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX notifications_created_at_idx ON public.notifications USING btree (created_at);


--
-- Name: notifications_is_read_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX notifications_is_read_idx ON public.notifications USING btree (is_read);


--
-- Name: notifications_user_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX notifications_user_id_idx ON public.notifications USING btree (user_id);


--
-- Name: pending_registrations_email_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX pending_registrations_email_idx ON public.pending_registrations USING btree (email);


--
-- Name: pending_registrations_email_key; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE UNIQUE INDEX pending_registrations_email_key ON public.pending_registrations USING btree (email);


--
-- Name: pending_registrations_expires_at_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX pending_registrations_expires_at_idx ON public.pending_registrations USING btree (expires_at);


--
-- Name: people_name_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX people_name_idx ON public.people USING btree (name);


--
-- Name: people_slug_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX people_slug_idx ON public.people USING btree (slug);


--
-- Name: people_slug_key; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE UNIQUE INDEX people_slug_key ON public.people USING btree (slug);


--
-- Name: reports_created_at_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX reports_created_at_idx ON public.reports USING btree (created_at);


--
-- Name: reports_reporter_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX reports_reporter_id_idx ON public.reports USING btree (reporter_id);


--
-- Name: reports_status_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX reports_status_idx ON public.reports USING btree (status);


--
-- Name: reports_target_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX reports_target_id_idx ON public.reports USING btree (target_id);


--
-- Name: reports_target_type_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX reports_target_type_idx ON public.reports USING btree (target_type);


--
-- Name: review_votes_review_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX review_votes_review_id_idx ON public.review_votes USING btree (review_id);


--
-- Name: reviews_created_at_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX reviews_created_at_idx ON public.reviews USING btree (created_at);


--
-- Name: reviews_movie_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX reviews_movie_id_idx ON public.reviews USING btree (movie_id);


--
-- Name: reviews_rating_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX reviews_rating_idx ON public.reviews USING btree (rating);


--
-- Name: reviews_user_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX reviews_user_id_idx ON public.reviews USING btree (user_id);


--
-- Name: reviews_user_id_movie_id_key; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE UNIQUE INDEX reviews_user_id_movie_id_key ON public.reviews USING btree (user_id, movie_id);


--
-- Name: sessions_session_token_key; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE UNIQUE INDEX sessions_session_token_key ON public.sessions USING btree (session_token);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX sessions_user_id_idx ON public.sessions USING btree (user_id);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_role_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX users_role_idx ON public.users USING btree (role);


--
-- Name: users_status_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX users_status_idx ON public.users USING btree (status);


--
-- Name: users_username_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX users_username_idx ON public.users USING btree (username);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: verification_tokens_identifier_token_key; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE UNIQUE INDEX verification_tokens_identifier_token_key ON public.verification_tokens USING btree (identifier, token);


--
-- Name: watchlist_created_at_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX watchlist_created_at_idx ON public.watchlist USING btree (created_at);


--
-- Name: watchlist_movie_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX watchlist_movie_id_idx ON public.watchlist USING btree (movie_id);


--
-- Name: watchlist_user_id_idx; Type: INDEX; Schema: public; Owner: avnadmin
--

CREATE INDEX watchlist_user_id_idx ON public.watchlist USING btree (user_id);


--
-- Name: accounts accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: audit_logs audit_logs_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: comment_votes comment_votes_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.comment_votes
    ADD CONSTRAINT comment_votes_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comment_votes comment_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.comment_votes
    ADD CONSTRAINT comment_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.comments(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: movie_genres movie_genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: movie_genres movie_genres_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: movie_people movie_people_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.movie_people
    ADD CONSTRAINT movie_people_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: movie_people movie_people_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.movie_people
    ADD CONSTRAINT movie_people_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.people(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: movies movies_submitter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_submitter_id_fkey FOREIGN KEY (submitter_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: people people_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reports reports_reporter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: review_votes review_votes_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.review_votes
    ADD CONSTRAINT review_votes_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review_votes review_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.review_votes
    ADD CONSTRAINT review_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: watchlist watchlist_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: watchlist watchlist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: avnadmin
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: avnadmin
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict S2J8sWef60fcLoTAxdhiWZ6hgjHphkb6gObn8tyf9egEt3WLAG6jqgZ0ZFZTvbW

