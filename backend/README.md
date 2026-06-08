# Footy-Trivia Backend API & Supabase Integration

This is the asynchronous Python FastAPI backend for the Footy-Trivia platform, backed by PostgreSQL 16 and integrated with Supabase Storage for asset management.

---

## 🛠️ Step-by-Step Supabase Dashboard Setup

To configure Supabase Storage for Footy-Trivia, perform these one-time manual steps:

1. **Log In & Create Project:**
   * Go to [supabase.com](https://supabase.com) and open your project dashboard.
2. **Create Storage Buckets:**
   * Click on **Storage** in the left sidebar menu.
   * Click the **New Bucket** button.
   * Create the following four buckets one by one. **Make sure to toggle the "Public bucket" switch to ON for all of them**:
     1. `avatars` (for user profiles)
     2. `team-logos` (for club & nation crests)
     3. `country-flags` (for country flags)
     4. `achievements` (for earned badges)
3. **Apply Row Level Security (RLS) Policies:**
   * In the left sidebar, click on the **SQL Editor**.
   * Click **New Query**.
   * Open the file [supabase_setup.sql](./supabase_setup.sql), copy the first half of the script (`SUPABASE STORAGE RLS POLICIES`), paste it into the editor, and click **Run**.
4. **Copy API Credentials:**
   * Go to **Project Settings** (gear icon in the sidebar) → **API**.
   * Copy the **Project URL** and paste it as `SUPABASE_URL` in your `.env` file.
   * Copy the **anon/public** key and paste it as `SUPABASE_ANON_KEY` in `.env`.
   * Copy the **service_role** key (click "Reveal" and copy) and paste it as `SUPABASE_SERVICE_KEY` in `.env`.
5. **Backfill Existing Data:**
   * Run the second half of `supabase_setup.sql` in the SQL Editor to update your seed data flags and team logos to use Supabase public URLs. Remember to replace `placeholder-project-ref` with your actual Supabase project reference ID.

---

## 🚀 Running Locally (Docker Compose)

### 1. Configure the Environment
Ensure your `/backend/.env` is fully populated:
```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/footytrivia
SECRET_KEY=replace-with-a-long-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
STORAGE_AVATAR_BUCKET=avatars
STORAGE_LOGOS_BUCKET=team-logos
STORAGE_FLAGS_BUCKET=country-flags
STORAGE_ACHIEVEMENTS_BUCKET=achievements
```

### 2. Start the Stack
From the `/backend` directory, run:
```bash
docker-compose up --build
```
This spins up:
* **`db` (Postgres 16)**: Auto-initialized with tables, constraints, indexes, and initial seed data.
* **`web` (FastAPI)**: Running on `http://localhost:8000` with hot-reload enabled.

---

## 🧪 Testing the Upload Endpoints (MIME/Size Checked)

Here are curl examples to test the endpoints:

### 1. Upload User Avatar (JWT Protected)
```bash
curl -X POST "http://localhost:8000/api/profile/avatar" \
     -H "Authorization: Bearer YOUR_JWT_ACCESS_TOKEN" \
     -F "file=@/path/to/my_avatar.png"
```

### 2. Update Profile & Upload Avatar Simultaneously (multipart/form-data)
```bash
curl -X PUT "http://localhost:8000/api/profile" \
     -H "Authorization: Bearer YOUR_JWT_ACCESS_TOKEN" \
     -F "display_name=Sohaib" \
     -F "bio=Football enthusiast" \
     -F "avatar=@/path/to/my_avatar.png"
```

### 3. Upload Team Logo (Admin Only)
```bash
curl -X POST "http://localhost:8000/api/admin/teams/1/logo" \
     -H "Authorization: Bearer ADMIN_JWT_ACCESS_TOKEN" \
     -F "file=@/path/to/man_utd_logo.png"
```

### 4. Upload Country Flag (Admin Only)
```bash
curl -X POST "http://localhost:8000/api/admin/countries/ENG/flag" \
     -H "Authorization: Bearer ADMIN_JWT_ACCESS_TOKEN" \
     -F "file=@/path/to/england_flag.svg"
```

### 5. Upload Achievement Badge Icon (Admin Only)
```bash
curl -X POST "http://localhost:8000/api/admin/achievements/1/icon" \
     -H "Authorization: Bearer ADMIN_JWT_ACCESS_TOKEN" \
     -F "file=@/path/to/achievement_badge.png"
```
