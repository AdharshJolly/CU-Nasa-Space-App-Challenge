
# NASA International Space Apps Challenge 2025 - CHRIST University, Bangalore

This project is a modern, full-featured hackathon event website for the NASA International Space Apps Challenge 2025, hosted at CHRIST (Deemed to be University), Bangalore Kengeri Campus.

## 🌟 Features

- **Engaging Landing Page**: A visually appealing hero section with event details, key sponsors, and animated space-themed visuals.
- **Comprehensive Event Information**: Sections for About, Schedule/Timeline, Rules, Perks, and Live Updates.
- **Dynamic Online Registration**: A robust registration form with team management, real-time validation, AI-powered team name generation, and automated Google Sheet syncing.
- **Live Problem Statements**: Real-time display of hackathon challenges, which can be toggled live from the admin dashboard.
- **Sponsors & Collaborators Showcase**: A dedicated section to display logos for all event sponsors and partners.
- **Live Countdown Timer**: A real-time countdown to the event's start to build excitement.
- **Contact/Queries Section**: A detailed section for contacting faculty and student coordinators.
- **Advanced Admin Dashboard**: A secure area for organizers to manage problem statements, timeline events, and other site content. It also includes tools to export registration data to Excel and manually sync to Google Sheets.

## 🛠️ Tech Stack

- **Next.js 14** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS** (with a custom space-themed design system)
- **Firebase** (Firestore for the database, Auth for admin access)
- **Genkit AI** (for AI-powered team name generation)
- **Shadcn/UI** & **Radix UI** (for accessible and reusable UI components)
- **Google Sheets API** (for automated and manual data syncing)

## 🚀 Quick Start

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Set up environment variables:**
    -   Copy `.env.example` to `.env.local` and fill in your Firebase and Google Sheets API credentials.
3.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 📁 Project Structure

- `src/app/` - Main application pages, layouts, and API routes.
- `src/components/sections/` - All major homepage sections (Hero, About, Schedule, etc.).
- `src/components/admin/` - Components for the admin dashboard, including dialogs for managing data.
- `src/lib/` - Utility functions and Firebase configuration.
- `src/ai/` - Genkit AI flows, such as the team name generator.
- `public/` - Static assets, including images and `sitemap.xml`.

## 🎨 Style Guide

- **Primary color:** #192A56 (dark navy blue)
- **Background:** #0A122A (almost black)
- **Accent:** #43B1F0 (electric blue)
- **Fonts:** 'Space Grotesk' for headlines, 'Inter' for body text.

## 🙋 Contact & Support

For any queries, please use the Contact section on the website or reach out to the coordinators directly.

---

Made with ❤️ for the global Space Apps community.
