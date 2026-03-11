# Wander — Mini Travel Experience Listing Platform

A full-stack web platform where experience providers can create accounts, publish travel experiences, and travelers can discover them in a public feed.

---

## Live Demo

> **Demo URL:** _(add your deployed URL here)_  
> **GitHub:** _(add your repo URL here)_

**Demo credentials:**
- Email: `sofia@demo.com` / Password: `demo1234`
- Email: `marco@demo.com` / Password: `demo1234`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Vite |
| Backend | Node.js, Express 4 |
| Database | SQLite via `better-sqlite3` |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Styling | Custom CSS (CSS Variables, no framework) |

---

## Features

### Core
- ✅ User registration and login with JWT authentication
- ✅ Public feed of travel experience listings (no login required)
- ✅ Search listings by keyword (title, description, location, country)
- ✅ Filter by category (Adventure, Food & Drink, Cultural, etc.)
- ✅ Pagination / "Load More" for the public feed
- ✅ Create, read, update, and delete listings (authenticated users)
- ✅ Owner-only edit/delete controls
- ✅ Personal dashboard with listing management

### Optional / Bonus
- ✅ Seeded sample data (8 listings, 3 demo users) on first run
- ✅ Category-based visual themes (gradients + emoji)
- ✅ Tag support on listings
- ✅ Input validation on both client and server
- ✅ Toast notifications for user feedback
- ✅ Responsive design
- ✅ Sticky booking card on listing detail page

---

## Project Structure

```
travel-platform/
├── backend/
│   ├── routes/
│   │   ├── auth.js         # Register, login, /me
│   │   └── listings.js     # CRUD + public feed + my listings
│   ├── db.js               # SQLite schema + seed data
│   ├── server.js           # Express app entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ListingCard.jsx
│   │   │   ├── ListingForm.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ListingDetailPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── CreateListingPage.jsx
│   │   │   └── EditListingPage.jsx
│   │   ├── utils/listing.js
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
└── README.md
```

---

## Database Schema

```sql
users
  id            INTEGER PRIMARY KEY AUTOINCREMENT
  name          TEXT NOT NULL
  email         TEXT NOT NULL UNIQUE
  password_hash TEXT NOT NULL
  avatar_seed   TEXT
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP

listings
  id             INTEGER PRIMARY KEY AUTOINCREMENT
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
  title          TEXT NOT NULL
  description    TEXT NOT NULL
  location       TEXT NOT NULL
  country        TEXT NOT NULL
  category       TEXT NOT NULL
  duration_hours REAL NOT NULL
  price_usd      REAL NOT NULL
  max_guests     INTEGER NOT NULL DEFAULT 10
  tags           TEXT DEFAULT '[]'         -- stored as JSON array
  is_published   INTEGER DEFAULT 1
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
  updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP

-- Indexes
idx_listings_user_id    ON listings(user_id)
idx_listings_category   ON listings(category)
idx_listings_country    ON listings(country)
idx_listings_created_at ON listings(created_at DESC)
```

**Design decisions:**
- Tags stored as JSON string in SQLite for simplicity (would be a separate `listing_tags` table in PostgreSQL at scale)
- `is_published` flag allows soft-unpublish without deletion
- Foreign key `ON DELETE CASCADE` ensures orphaned listings are cleaned up
- WAL journal mode enabled for better concurrent read performance

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Sign in, receive JWT |
| GET | `/api/auth/me` | ✅ Bearer | Get current user |

### Listings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/listings` | — | Public feed (search, filter, paginate) |
| GET | `/api/listings/:id` | — | Single listing |
| POST | `/api/listings` | ✅ | Create listing |
| PUT | `/api/listings/:id` | ✅ Owner | Update listing |
| DELETE | `/api/listings/:id` | ✅ Owner | Delete listing |
| GET | `/api/listings/my/listings` | ✅ | Authenticated user's listings |

**Public feed query params:** `?search=&category=&limit=20&offset=0`

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repo

```bash
git clone <repo-url>
cd travel-platform
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env
# Edit .env — set JWT_SECRET to a random string in production
npm install
npm run dev
# API running at http://localhost:5000
```

The SQLite database (`travel.db`) is created automatically on first run with 8 sample listings and 3 demo user accounts.

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

The Vite dev server proxies `/api` requests to port 5000 automatically.

---

## Product Thinking: Scaling to 10,000+ Listings

If this platform reached 10,000 travel listings, several changes would meaningfully improve performance and user experience.

**Pagination and discovery:** The current "load more" approach should be augmented with cursor-based pagination for stable results as new listings are added. Adding a map-based browsing view (clustered pins by region) would help travelers discover by geography rather than just scrolling a feed.

**Search and filtering:** Full-text search against SQLite `LIKE` queries does not scale. I would migrate to a dedicated search engine such as Meilisearch or Elasticsearch, which support relevance ranking, typo-tolerance, faceted filtering (price range, duration, guest count), and near-instant results across all fields. This would transform the browsing experience.

**Database indexing and migration:** At this scale, I'd migrate from SQLite to PostgreSQL. The existing indexes on `category`, `country`, and `created_at` would still apply, but I'd add composite indexes on common filter combinations (e.g., `(category, country, created_at)`) and a GIN index for full-text search if staying in PostgreSQL.

**Caching:** The public listing feed — especially the homepage default view — is read far more often than it's written. I'd add Redis caching with a short TTL (e.g., 60 seconds) on the paginated feed endpoint, and longer caching on individual listing pages. Cache invalidation would trigger on any listing create/update/delete.

**API and image optimization:** Listing cover images (currently emoji-based) would need a CDN with automatic resizing and WebP conversion. The API response should also trim listing payloads in list views (returning only fields needed for cards) vs. full detail for individual pages, reducing JSON payload sizes significantly.

**Infrastructure:** Deploying the API behind a load balancer with horizontal scaling, connection pooling (PgBouncer for PostgreSQL), and read replicas would allow read-heavy workloads to scale independently of writes.

---

## Implementation Notes

- **Authentication:** Passwords hashed with bcrypt (cost factor 10). JWTs expire after 7 days.
- **Authorization:** Owner-only mutations are enforced server-side — the frontend hides edit/delete UI but the API validates `user_id === req.userId` independently.
- **Validation:** Both client-side (immediate feedback) and server-side (source of truth).
- **Error handling:** All API errors return consistent `{ error: "..." }` JSON with appropriate HTTP status codes.
- **No external image hosting** was implemented to keep setup zero-config. In production, I'd integrate an upload endpoint backed by S3 or Cloudinary.
