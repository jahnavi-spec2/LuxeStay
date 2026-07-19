

Readme · MD
# GoHotel Prudence 🏨
 
A full-stack hotel booking web app — browse hotels, filter by location, sort by price/rating, view detailed listings, and book stays with secure, cookie-based authentication.
 
**Live demo:** _add your deployed link here_
 
---
 
## Features
 
- 🔍 Browse & filter hotels by location
- ↕️ Sort by price (low→high / high→low) or rating
- 🖼️ Rotating hero carousel + per-hotel photo galleries
- 🔐 JWT auth via httpOnly cookies, bcrypt-hashed passwords
- 📅 Live booking with date validation and auto-calculated price
- 📋 My Bookings page with cancellation
- 📱 Fully responsive, dark/gold themed UI
## Tech Stack
 
**Frontend:** React (Vite), React Router, Context API, custom CSS, react-icons
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, cookie-parser
 
## Project Structure
 
```
gohotel-prudence/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── pages/         # Home, HotelDetails, Login, Signup, MyBookings
│   │   ├── context/        # AuthContext (login/signup/logout state)
│   │   ├── utils/           # api.js (fetch wrapper), helper.js
│   │   ├── Third.jsx        # Hero, ProductListing, CategoriesSection, SortBar
│   │   ├── Footer.jsx
│   │   ├── navBar.jsx
│   │   ├── Pagination.jsx
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
├── backend/            # Express + MongoDB API
│   ├── controllers/       # user.controller.js, booking.controller.js
│   ├── middleware/         # auth.middleware.js (verifyJWT), errorHandler.js
│   ├── models/               # user.model.js, booking.model.js
│   ├── routes/                # user.routes.js, booking.routes.js
│   ├── db/                     # index.js (Mongo connection)
│   ├── utils/                   # ApiError.js, ApiResponse.js, AsyncHandler.js
│   ├── app.js
│   ├── server.js (index.js)
│   └── package.json
│
└── README.md            ← you are here
```
 
> If your repo currently has `frontend/` and `backend/` as two separate folders under one parent, put **this file at the parent (root) level** — it documents both. Keep the auto-generated `README.md` inside `frontend/` too (Vite creates it by default); this root one is the "how the whole project fits together" doc, not a replacement for it.
 
## Getting Started
 
### 1. Clone & install
 
```bash
git clone <your-repo-url>
cd gohotel-prudence
 
cd backend && npm install
cd ../frontend && npm install
```
 
### 2. Environment variables
 
**`backend/.env`**
```env
PORT=8001
MONGO_URI=mongodb://localhost:27017/gohotel      # or your MongoDB Atlas URI
ACCESS_TOKEN_SECRET=your_long_random_secret_here
ACCESS_TOKEN_EXPIRY=1d
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```
 
**`frontend/.env`**
```env
VITE_API_URL=http://localhost:8001/api
```
 
> In production, set `NODE_ENV=production` on the backend and `VITE_API_URL` to your deployed backend's URL. This also flips cookies to `secure: true, sameSite: "none"` for cross-domain auth.
 
### 3. Run locally
 
```bash
# terminal 1 — backend
cd backend
npm run dev
 
# terminal 2 — frontend
cd frontend
npm run dev
```
 
Frontend runs on `http://localhost:5173`, backend on `http://localhost:8001`.
 
## API Overview
 
| Method | Endpoint                    | Auth required | Description              |
|--------|------------------------------|:---:|---------------------------|
| POST   | `/api/usersauth/register`    | ❌  | Create an account          |
| POST   | `/api/usersauth/login`       | ❌  | Log in, sets auth cookie   |
| POST   | `/api/usersauth/logout`      | ❌  | Clears auth cookie         |
| GET    | `/api/usersauth/me`          | ✅  | Get current logged-in user |
| POST   | `/api/bookings`               | ✅  | Create a booking            |
| GET    | `/api/bookings/me`             | ✅  | Get my bookings              |
| GET    | `/api/bookings/:id`             | ✅  | Get a single booking          |
| PATCH  | `/api/bookings/:id/cancel`       | ✅  | Cancel a booking               |
 
## Deployment
 
1. **Database** — MongoDB Atlas (free tier)
2. **Backend** — Render / Railway. Set env vars from above, plus `CORS_ORIGIN` pointed at your deployed frontend URL.
3. **Frontend** — Vercel / Netlify. Set `VITE_API_URL` to your deployed backend URL + `/api`.
## Roadmap
 
- [ ] Payment gateway integration
- [ ] Hotel owner / admin dashboard
- [ ] User reviews & ratings
- [ ] Email booking confirmations
- [ ] 404 / error boundary page
## License
 
MIT — free to use and modify.
 
