# WhereMyFoodAt

A premium full-stack restaurant reservation web application built with React, Vite, TailwindCSS, and Supabase.

## Features
- **Authentication**: Secure login and registration via Supabase Auth.
- **Dashboard**: View statistics, loyalty points, and available tables for tonight.
- **Search & Discover**: Filter restaurants by name, cuisine, price range, and minimum rating. Real-time updates.
- **Restaurant Details**: View comprehensive restaurant info, active offers, and make reservations.
- **Bookings Management**: View upcoming and past reservations. Cancel reservations with a single click.
- **Loyalty System**: Earn points automatically for completed reservations.

## Setup Instructions

### 1. Prerequisites
- Node.js installed (v16+)
- A Supabase account (free tier works)

### 2. Supabase Configuration
1. Create a new project in your Supabase dashboard.
2. Navigate to the SQL Editor.
3. Copy the contents of `supabase/schema.sql` and run it in the SQL Editor to set up tables, RLS policies, triggers, and seed data.

### 3. Environment Variables
1. Rename `.env.example` to `.env` (or create a `.env` file in the root directory).
2. Add your Supabase project URL and anon key:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Installation
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### 5. Access
The app will be running at `http://localhost:5173`.
You can sign up for a new account or use the demo account:
- **Email:** cherry@demo.com
- **Password:** (Set a password manually in Supabase Auth dashboard if you wish to use the seeded user, or simply create a new user via the Register page).

## Technologies
- React 18
- React Router v6
- TailwindCSS 3
- Supabase (PostgreSQL, Auth, RLS)
- Lucide React (Icons)
- Vite
