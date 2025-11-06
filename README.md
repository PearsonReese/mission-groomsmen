# Mission Groomsmen - Terminal Wedding Invitation

A Mission Impossible-themed terminal interface for groomsmen wedding invitations - built with Bun, TypeScript, React, Tailwind, and hosted on Cloudflare Pages and Workers.

## 🚀 Quick Start

### Install Dependencies
```bash
bun install
```

### Start Development Server
```bash
bun dev
```

### Build for Production
```bash
bun run build
```

### Run Production Build
```bash
bun start
```

## 🛠️ Local Development with Backend

### 1. Start the Cloudflare Worker (Backend)
```bash
cd cloudflare-setup
bun install
wrangler dev --local
# Server runs at http://127.0.0.1:8787
```

### 2. Start the Frontend
```bash
# In your main project directory
bun dev
# Frontend runs at http://localhost:3000
```

### 3. Access the App
- **Main App**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

## 📊 Backend Integration

This app includes a complete Cloudflare backend for data collection:
- **User Sessions**: Track who accessed the invitation
- **Mission Completion**: See completion rates
- **Groom Advice**: All funny stories and advice in one place
- **Easter Egg Analytics**: Track which hidden features guests discover

### Admin Dashboard
Access at `/admin` with your admin password to view:
- Real-time statistics and engagement metrics
- All submitted groom advice and stories
- Easter egg discovery analytics
- Recent visitor activity

## 🎬 Features

- **Mission Impossible Theme**: Complete terminal styling with authentic feel
- **Bridal Party Flows**: Special handling for groomsmen, bridesmaids, bride, and groom's sister
- **Easter Egg System**: Hidden celebrity flows and secret features
- **Mobile Optimized**: Touch-friendly interface with auto-focus management
- **Audio Integration**: Mission Impossible theme music with controls
- **Backend Analytics**: Complete data collection and admin dashboard

## 🏗️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Runtime**: Bun
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Cloudflare Workers + D1 Database
- **Deployment**: Cloudflare Pages

## 📁 Project Structure

```
mission-groomsmen/
├── src/                    # React frontend
│   ├── components/        # UI components
│   ├── services/          # API integration
│   └── utils/             # Mission data
├── cloudflare-setup/      # Backend Worker
│   ├── worker.ts          # API endpoints
│   ├── schema.sql         # Database structure
│   └── wrangler.toml      # Worker config
└── public/                # Static assets
```

## 👥 Configure Participants

- Edit `src/utils/missionData.ts`:
  - `groomsmenNames`: full names; authenticate by last name.
  - `bridesmaidNames`: full names; authenticate by last name.
  - Content blocks (`brideContent`, `bridesmaidContent`, `bestManContent`) drive tailored mission briefings.

Notes:
- Bridesmaids receive a special “Bride Pawsee” mission briefing focused on surveilling, protecting, and hyping up the bride, including a lighthearted note that the bride explicitly granted their system access.
- Family entries can authenticate by entering their last name from `familyAndFriendsNames`.

## 🚀 Deployment

### Frontend (Cloudflare Pages)
```bash
bun run build
# Deploy to Cloudflare Pages
```

### Backend (Cloudflare Workers)
```bash
cd cloudflare-setup
wrangler deploy
```

## 🎯 Mission Status

**MISSION IMPOSSIBLE: ACCOMPLISHED!** 

This application transforms wedding invitations into an immersive, gamified experience that exceeds all expectations with advanced features, mobile optimization, and complete backend integration.

---

This project was created using `bun init` in bun v1.2.19. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
