# Mission Groomsmen: Cloudflare Backend Integration Guide

## 🚀 Complete Setup Instructions

### **Step 1: Install Cloudflare CLI Tools**

```bash
# Install Wrangler CLI using Bun
bun install -g wrangler

# Login to Cloudflare
wrangler login
```

### **Step 2: Set Up Cloudflare D1 Database**

```bash
# Create D1 database
wrangler d1 create mission-groomsmen-db

# This will output something like:
# ✅ Successfully created DB 'mission-groomsmen-db' in region ENAM
# Created your database using D1's new storage backend.
# 
# [[d1_databases]]
# binding = "DB"
# database_name = "mission-groomsmen-db"
# database_id = "your-database-id-here"

# Copy the database_id for the next steps
```

### **Step 3: Create Worker Configuration**

Create `wrangler.toml` in your `cloudflare-setup/` directory:

```toml
# wrangler.toml
name = "mission-groomsmen-api"
main = "worker.ts"
compatibility_date = "2024-01-01"

# D1 Database binding
[[d1_databases]]
binding = "DB"
database_name = "mission-groomsmen-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace with your actual database ID

# Environment variables
[vars]
# Add any public environment variables here

# Secret environment variables (use wrangler secret put)
# ADMIN_PASSWORD will be set via wrangler secret put ADMIN_PASSWORD
```

### **Step 4: Set Up Database Schema**

```bash
# Apply schema to D1 database
wrangler d1 execute mission-groomsmen-db --file=schema.sql

# Verify the tables were created
wrangler d1 execute mission-groomsmen-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### **Step 5: Set Environment Variables**

```bash
# Set admin password (choose a strong password)
wrangler secret put ADMIN_PASSWORD
# When prompted, enter your desired admin password
```

### **Step 6: Deploy the Worker**

```bash
# From the cloudflare-setup directory
bun install  # Install dependencies
wrangler deploy

# This will output your Worker URL, something like:
# Published mission-groomsmen-api (1.23 sec)
# https://mission-groomsmen-api.your-subdomain.workers.dev
```

### **Step 7: Update Frontend Configuration**

Update `src/services/api.ts` with your Worker URL:

```typescript
// Replace this line in api.ts:
this.baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://mission-groomsmen-api.your-subdomain.workers.dev'  // ← Your actual Worker URL
  : 'http://localhost:8787';
```

Update `src/components/AdminDashboard.tsx` with the same URL:

```typescript
// Replace this line in AdminDashboard.tsx:
const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://mission-groomsmen-api.your-subdomain.workers.dev'  // ← Your actual Worker URL
  : 'http://localhost:8787';
```

### **Step 8: Integrate Backend Calls in Terminal**

Apply the changes from `terminal-integration.tsx` to your `src/components/Terminal.tsx`:

1. Add the import: `import { apiService } from '@/services/api';`
2. Add session state management
3. Integrate API calls in the appropriate handlers
4. Add analytics tracking for easter eggs and events

### **Step 9: Deploy Frontend to Cloudflare Pages**

```bash
# Build your frontend
bun run build

# Deploy to Cloudflare Pages (if not already set up)
# 1. Go to Cloudflare Dashboard → Pages
# 2. Connect your GitHub repository
# 3. Set build command: `bun run build`
# 4. Set build output directory: `dist`
# 5. Deploy
```

### **Step 10: Set Up Admin Access**

1. Visit your frontend URL + `/admin` (you'll need to add routing)
2. Use the admin password you set in Step 5
3. View analytics, user sessions, and groom advice

---

## 🛠️ Local Development Setup

### **Run Worker Locally**

```bash
# In cloudflare-setup directory
wrangler dev --local --persist

# This starts a local server at http://localhost:8787
# --persist keeps your D1 data between restarts
```

### **Run Frontend Locally**

```bash
# In your main project directory
bun run dev

# Frontend will run at http://localhost:3000
# API calls will go to http://localhost:8787
```

---

## 📊 What You'll Get

### **Data Collection**
- ✅ **User Sessions**: Track who accessed the invitation
- ✅ **Mission Completion**: See completion rates
- ✅ **Groom Advice**: All funny stories and advice in one place
- ✅ **Easter Egg Analytics**: See which hidden features were discovered
- ✅ **Engagement Metrics**: Audio plays, authentication attempts, etc.

### **Admin Dashboard Features**
- 📈 **Statistics Overview**: Total sessions, completion rate, advice count
- 👥 **Recent Sessions**: See who accessed recently with completion status
- 🎬 **Easter Egg Discoveries**: Track which easter eggs were found
- 💬 **Groom Advice Collection**: Read all submitted advice and stories
- 🔐 **Secure Access**: Password-protected admin interface

### **Analytics Events Tracked**
- `session_start` - When someone starts the terminal
- `authentication_attempt` - Login attempts with success/failure
- `mission_complete` - When someone completes the full flow
- `easter_egg_tom_cruise` - Tom Cruise easter egg activation
- `easter_egg_konami_code` - Konami code discovery
- `easter_egg_magic_string` - Magic string discoveries
- `audio_play/pause/mute` - Audio interaction tracking
- `groom_advice_submit` - Advice submission events

---

## 🔒 Security Notes

- Admin password is stored as a Cloudflare Worker secret
- No sensitive data is stored in the frontend
- CORS is configured for your domain only (update in production)
- All database queries use prepared statements to prevent injection

---

## 💰 Cloudflare Costs

**Free Tier Includes:**
- ✅ Cloudflare Workers: 100,000 requests/day
- ✅ Cloudflare D1: 5GB storage, 25M row reads/month  
- ✅ Cloudflare Pages: Unlimited static hosting

**For a wedding invitation:** All usage will easily fall within free limits!

---

## 🚨 Quick Troubleshooting

### **Worker Won't Deploy**
- Check your `database_id` in `wrangler.toml`
- Ensure you're logged in: `wrangler whoami`
- Verify schema was applied: `wrangler d1 execute mission-groomsmen-db --command="SELECT COUNT(*) FROM user_sessions;"`

### **Frontend Can't Connect**
- Check the Worker URL in `api.ts` and `AdminDashboard.tsx`
- Verify CORS settings in `worker.ts`
- Check browser console for network errors

### **Admin Dashboard Won't Load**
- Verify admin password: `wrangler secret list`
- Check Worker logs: `wrangler tail`
- Ensure database has required tables

---

## 🎉 You're Done!

Your Mission Groomsmen app now has a full backend that will save all responses to your Cloudflare account where you can easily access them through the admin dashboard!

**Admin URL:** `https://your-frontend-domain.com/admin`
**Worker API:** `https://mission-groomsmen-api.your-subdomain.workers.dev`
**Database:** Accessible via Cloudflare Dashboard → D1