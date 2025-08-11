# NASA International Space Apps Challenge 2025 - CHRIST University, Bangalore

This project is a modern, full-featured hackathon event website for the NASA International Space Apps Challenge 2025, hosted at CHRIST (Deemed to be University), Bangalore Kengeri Campus.

## 🌟 Features

- **Landing Page**: Engaging hero section with event details, sponsors, and animated space-themed visuals.
- **Event Information**: About, schedule/timeline, rules, perks, and live updates.
- **Online Registration**: Dynamic registration form with team management and validation.
- **Problem Statements**: Real-time display of hackathon challenges (auto-updates as released).
- **Sponsors Showcase**: Logos and info for all event sponsors and partners.
- **Countdown Timer**: Live countdown to the event start.
- **Contact/Queries**: Section for contacting organizers and coordinators.
- **Admin Tools**: (For organizers) Add/edit problem statements and timeline events (see `src/components/admin/`).

## 🛠️ Tech Stack

- **Next.js 14** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS** (with custom space theme)
- **Firebase** (Firestore for data, Auth for admin, Hosting)
- **Genkit AI** (for team name generation, etc.)
- **Radix UI** (accessible UI components)

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Firebase credentials.
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Open [http://localhost:9002](http://localhost:9002) in your browser.**

## 📁 Project Structure

- `src/app/` - Main app pages and layout
- `src/components/sections/` - All major homepage/event sections (Hero, About, Schedule, Rules, Perks, ProblemStatements, Sponsors, Registration, Contact)
- `src/components/admin/` - Admin dialogs for managing event data
- `src/lib/firebase.ts` - Firebase config and initialization
- `src/ai/` - Genkit AI flows (e.g., team name generation)
- `assets/` - Logos, images, and space illustrations

## 🎨 Style Guide

- **Primary color:** #192A56 (dark navy blue)
- **Background:** #0A122A (almost black)
- **Accent:** #43B1F0 (electric blue)
- **Fonts:** 'Space Grotesk' for headlines, 'Inter' for body
- **Space-themed icons and subtle animations**

## 🙋 Contact & Support

For queries, contact the organizing team via the Contact section on the website or email:

- Dr. Joseph Rodriguez (Faculty Advisor): joseph.rodrigues@christuniversity.in
- Ms. Minu Narayanan (Logistics): minu.narayanan@christuniversity.in

Student Coordinators:

- Manoj Reddy: +91 9876543210
- Adharsh Jolly: +91 9876543211

---

Made with ❤️ for the global Space Apps community.
