# Rival Blog Platform - Local Development Guide

This guide provides comprehensive, step-by-step instructions to set up and run the Rival Blog Platform locally from scratch.

---

## 1️⃣ SYSTEM REQUIREMENTS
- **Node.js**: v20.x or higher
- **Package Manager**: npm (v10.x+)
- **PostgreSQL**: v15+ (Local via Docker or Neon.tech)
- **Redis**: v7+ (Required if using optional async summary jobs)
- **Global Tools**: `npx` (comes with npm)

---

## 2️⃣ ENVIRONMENT VARIABLES

The project uses separate `.env` files for the backend and frontend.

### Backend (`/backend/.env`)
Create a file named `.env` in the `/backend` directory:
```bash
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/rival_blog?schema=public"

# Authentication
JWT_SECRET="your_highly_secure_random_secret"

# Server Configuration
PORT=3000
FRONTEND_URL="http://localhost:3001"

# Async Jobs (Optional)
REDIS_URL="redis://localhost:6379"

# Cortex Integration
CORTEX_API_KEY="your_cortex_api_key"
```

### Frontend (`/frontend/.env.local`)
Create a file named `.env.local` in the `/frontend` directory:
```bash
# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3001"
```

---

## 3️⃣ DATABASE SETUP

### Option A: Using Neon DB (Cloud)
1. Sign up at [Neon.tech](https://neon.tech).
2. Create a new project and copy the connection string.
3. Update `DATABASE_URL` in `/backend/.env`.

### Option B: Local PostgreSQL (Docker)
Run the following command to start a local PostgreSQL instance:
```bash
docker run --name rival-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=rival_blog -p 5432:5432 -d postgres
```
Update `DATABASE_URL` in `/backend/.env` to:
`postgresql://postgres:password@localhost:5432/rival_blog?schema=public`

### Initialize Database
From the `/backend` directory:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 4️⃣ BACKEND RUN STEPS
1. **Navigate**: `cd backend`
2. **Install**: `npm install`
3. **Database**: (Ensure steps in section 3 are completed)
4. **Start**: `npm run start:dev`
5. **Verify**: Open `http://localhost:3000` or check the health endpoint (if implemented).

---

## 5️⃣ FRONTEND RUN STEPS
1. **Navigate**: `cd frontend`
2. **Install**: `npm install`
3. **Setup Env**: Ensure `.env.local` is present (from section 2).
4. **Start**: `npm run dev`
5. **Confirm Routes**:
   - `http://localhost:3001/login`
   - `http://localhost:3001/register`
   - `http://localhost:3001/feed`
   - `http://localhost:3001/dashboard`

---

## 6️⃣ REDIS SETUP (IF REQUIRED)
To support async jobs (e.g., background summary generation):
```bash
docker run --name rival-redis -p 6379:6379 -d redis
```
- **Verification**: `docker exec -it rival-redis redis-cli ping` (should return PONG).
- **Fallback**: If Redis is not running, async jobs will be queued locally or ignored depending on the implementation.

---

## 7️⃣ TESTING CHECKLIST
✅ **Registration**: Create a new account.
✅ **Login**: Access the platform with new credentials.
✅ **Create Blog**: Save a new story as a draft.
✅ **Publishing**: Toggle "Publish" and see it appearing on the public feed.
✅ **Feed**: Confirm the latest post shows up with correct metadata.
✅ **Engagement**: Like a post (count should increase instantly).
✅ **Discussion**: Add a comment and see it appended to the list.
✅ **Cortex**: Check if the AI Summary appears on the blog detail page.
✅ **Rate Limiting**: Rapidly refresh or submit forms to trigger the "Too many requests" toast.

---

## 8️⃣ COMMON ERRORS + FIXES
- **Prisma Client Missing**: Run `npx prisma generate` in the backend folder.
- **JWT Secret Missing**: Ensure `JWT_SECRET` is defined in `.env`.
- **CORS Issue**: Verify `FRONTEND_URL` in backend `.env` matches your frontend address.
- **401 Unauthorized**: Token expired or missing; clear localStorage and re-login.
- **429 Rate Limit**: Backend throttling active; wait 1 minute before retrying.
- **Port Conflict**: If 3000/3001 are taken, change `PORT` in backend and `NEXT_PUBLIC_API_URL` in frontend.

---

## 9️⃣ PROJECT RUN SCRIPT SUMMARY

**Backend:**
```bash
npm install
npx prisma migrate dev
npm run start:dev
```

**Frontend:**
```bash
npm install
npm run dev
```
