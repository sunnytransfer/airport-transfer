# Private Transfer Booking App

## Setup Instructions

### Backend (Server)
1. Open a terminal.
2. Navigate to `server` folder: `cd transport-booking-app/server`
3. Install dependencies: `npm install`
4. Start the server: `npm start`
   - The server will run on `http://localhost:5000`
   - It will automatically create a `transport.db` SQLite database file.

### Frontend (Client)
1. Open a new terminal.
2. Navigate to `client` folder: `cd transport-booking-app/client`
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`
   - Detailed Booking.com style UI will be available at `http://localhost:5173` (or similar).

## Features
- **Booking Form**: Includes smart logic for Returns (automatically calculates pickup time 4 hours before flight).
- **Admin Dashboard**: Go to `/admin` to view Arrivals and Departures side-by-side. 
  - Includes CSV Export.
- **Image Optimization**: Backend includes logic to resize and convert uploads to WebP (requires `sharp`).
- **SEO**: Semantic HTML and Meta tags included.
