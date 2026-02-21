# Transport Booking App

## Overview
A professional Booking.com-style transport booking application with a Navy Blue & Yellow theme.

### Features
- **Smart Return Logic**: Automatically sets pickup time to 4 hours before flight time for return trips.
- **Blog**: "Travel Blog" with a professional introductory post.
- **Admin Panel**: "Arrivals" and "Departures" tables with One-Click Export to CSV.
- **Design**: Navy Blue (#003580) and Yellow (#febb02) theme with stylish icons.
- **Tech Stack**: React (Vite) + Node.js (Express) + SQLite.

## How to Run

### 1. Start the Server (Backend)
```bash
cd server
npm install
node index.js
```
The server runs on `http://localhost:5000`.

### 2. Start the Client (Frontend)
```bash
cd client
npm install
npm run dev
```
The client runs on `http://localhost:5173`.

## Admin Access
Navigate to `/admin` (e.g., `http://localhost:5173/admin`) to view the dashboard and export bookings.

## Social Icons
Stylish icons for TikTok, Instagram, Facebook, and YouTube are integrated into the Navbar and Footer.
