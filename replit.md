# LabourConnect - Pan-India Labour & Technician Marketplace

## Project Overview
LabourConnect is a mobile-first marketplace connecting customers with local labour and technicians across India. It features a wallet-based contact unlock system, job posting and bidding, multilingual support, and voice search capabilities.

## Key Features Implemented

### Authentication
- **OTP-based authentication** for Indian mobile numbers (10 digits)
- Login and signup flows with role selection (Customer / Technician)
- OTP is generated and logged to console in development mode for testing
- Session persisted in localStorage

### User Roles

#### Customer Features
1. **Browse Technicians**: Search by category and location with real-time filtering
2. **Service Category Slider**: Visual category browser with 100+ labour categories
3. **Voice Search**: Web Speech API integration for hands-free location search
4. **Wallet System**: 
   - Initial balance: ₹0
   - Recharge functionality with mock payment
   - Contact unlock costs ₹10 per technician
5. **Job Posting**: Create job posts with title, description, budget, location
6. **View Bids**: See technician bids on posted jobs
7. **Contact Unlock**: Pay ₹10 to unlock technician contact details

#### Technician Features
1. **Profile Management**: Skills, experience, location, availability status
2. **Browse Jobs**: View all available (open status) jobs
3. **Place Bids**: Submit bids with custom amount and message
4. **My Bids**: Track all submitted bids with job details
5. **Rating System**: Display average rating and total reviews

### Multilingual Support
- English and Hindi language options
- Language switcher in header
- Translations for common UI text

### Design System
- **Dark theme** with WhatsApp green (#06b39a) accent color
- Mobile-first responsive design optimized for low-end smartphones
- Shadcn UI components with custom theming
- Loading states, empty states, and error handling throughout

## Data Persistence

The application now uses **PostgreSQL** for persistent data storage. All user data, jobs, bids, wallets, and transactions are saved to the database and persist across server restarts.

- **Database**: PostgreSQL (Neon-backed)
- **ORM**: Drizzle ORM with TypeScript
- **Schema**: Automatically created via `npm run db:push`
- **Storage Implementation**: `server/db-storage.ts` (DbStorage class)

### How It Works
1. User data is immediately persisted when created
2. Jobs and bids are saved to database
3. Wallet balances are tracked in database
4. OTP codes are stored (with expiration)
5. Chat unlocks are recorded

## Technical Architecture

### Frontend (`/client`)
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query v5) for server state
- **UI Components**: Shadcn UI with Radix primitives
- **Styling**: Tailwind CSS with custom dark theme
- **Form Handling**: React Hook Form with Zod validation

### Backend (`/server`)
- **Framework**: Express.js with TypeScript
- **Storage**: PostgreSQL database via Drizzle ORM (`db-storage.ts`)
- **Validation**: Zod schemas for request validation
- **API Style**: RESTful JSON APIs
- **Storage Interface**: `IStorage` interface (`storage.ts`) allows switching between database and in-memory storage

### Data Schema (`/shared/schema.ts`)
All data models with Zod validation:
- Users (customer/technician roles, wallet balance)
- Technicians (skills, location, rating)
- Jobs (status: open/in-progress/completed/cancelled)
- Bids (status: pending/accepted/rejected)
- Transactions (wallet recharges)
- ChatUnlocks (contact access records)
- Reviews (1-5 star ratings)
- OtpCodes (authentication)
- Labour Categories (100+ categories organized by industry)

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to mobile number
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/signup` - Create new user account

### Users
- `GET /api/users/:id` - Get user by ID

### Technicians
- `GET /api/technicians` - List all technicians (filters: category, location)
- `GET /api/technicians/my-profile?userId={id}` - Get technician profile for user

### Jobs
- `GET /api/jobs` - List jobs (filters: customerId, status)
- `GET /api/jobs/my-jobs?customerId={id}` - Get customer's jobs
- `GET /api/jobs/available` - Get open jobs for technicians
- `POST /api/jobs` - Create new job
- `PATCH /api/jobs/:id/status` - Update job status

### Bids
- `GET /api/bids/job/:jobId` - Get all bids for a job
- `GET /api/bids/my-bids?technicianId={id}` - Get technician's bids
- `POST /api/bids` - Place new bid
- `PATCH /api/bids/:id/status` - Update bid status

### Wallet
- `POST /api/wallet/recharge` - Add money to wallet (body: {userId, amount})

### Chat Unlocks
- `GET /api/chat-unlocks/my-unlocks?customerId={id}` - Get customer's unlocked contacts
- `POST /api/chat-unlocks` - Unlock contact (body: {customerId, technicianId})

### Reviews
- `GET /api/reviews/technician/:technicianId` - Get technician reviews
- `POST /api/reviews` - Submit review

## Development Setup

### Running the Application
```bash
npm run dev
```
This starts both Express backend (port 5000) and Vite dev server with HMR.

### Seed Data
Application is seeded with:
- 5 technicians (various skills: Electrician, Plumber, Carpenter, Painter, Mason)
- 2 customers with wallet balance (₹500, ₹300)
- 3 job posts
- 3 bids
- All in Mumbai, Delhi, Bangalore, Pune, Hyderabad locations

### Testing Credentials
After running the app:
1. Navigate to `/signup`
2. Select role (Customer or Technician)
3. Enter any 10-digit phone number
4. Click "Send OTP"
5. Check console logs for OTP code (e.g., `[OTP] Code for 9876543210: 123456`)
6. Enter the OTP and verify

Or use existing seeded users:
- Customer: 9876543210, 9876543211
- Technician: 9876543212-9876543216

## Key User Flows

### Customer Journey
1. **Sign up** → Select "Customer" → Enter phone → Verify OTP
2. **Browse technicians** → Filter by category/location → Use voice search
3. **Unlock contact** → Click "Unlock Contact" → Confirm ₹10 payment → View phone number
4. **Post job** → Click "Post New Job" → Fill form → Submit
5. **View bids** → Go to "My Jobs" tab → Click job card → See bids
6. **Recharge wallet** → Click wallet balance → Enter amount → Mock payment

### Technician Journey
1. **Sign up** → Select "Technician" → Enter phone → Verify OTP
2. **Update profile** → Add skills, experience, location (future feature)
3. **Browse jobs** → View available jobs in "Available Jobs" tab
4. **Place bid** → Click "Bid Now" → Enter amount and message → Submit
5. **Track bids** → Go to "My Bids" tab → View bid status

## File Structure

```
/client/src
  /components
    - app-header.tsx         # App header with wallet, language, logout
    - language-provider.tsx  # Multilingual context
    - voice-search.tsx       # Speech recognition for search
    - service-category-slider.tsx # Category carousel
    - technician-card.tsx    # Technician display card
    - job-card.tsx           # Job display card
    - post-job-modal.tsx     # Job creation modal
    - place-bid-modal.tsx    # Bid submission modal
    - unlock-contact-modal.tsx # Contact unlock confirmation
    - recharge-modal.tsx     # Wallet recharge modal
    /ui                      # Shadcn UI components
  /pages
    - home.tsx               # Landing page
    - login.tsx              # OTP login
    - signup.tsx             # Registration with role selection
    - customer-dashboard.tsx # Customer main view
    - technician-dashboard.tsx # Technician main view
  /lib
    - queryClient.ts         # React Query config + apiRequest helper

/server
  - app.ts                   # Express app setup
  - routes.ts                # API route handlers
  - storage.ts               # In-memory storage implementation
  - seed-data.ts             # Sample data generator

/shared
  - schema.ts                # Shared types and validation schemas

design_guidelines.md         # Design system documentation
```

## Design Guidelines

See `design_guidelines.md` for:
- Color palette (dark theme + WhatsApp green)
- Typography scale
- Spacing system
- Component usage patterns
- Mobile-first breakpoints
- Accessibility requirements

## Known Limitations (MVP)

1. **Mock OTP**: OTP is logged to console (not sent via SMS)
2. **Mock Payment**: Wallet recharge doesn't integrate with real payment gateway (uses mock response)
3. **No Real-time Chat**: Contact unlock shows phone number but no in-app messaging
4. **No Image Upload**: Profile pictures not supported yet
5. **No Geolocation**: Location is text-based search, no GPS integration

## Future Enhancements

- Razorpay payment integration
- SMS OTP via Twilio/MSG91
- PostgreSQL database with Drizzle ORM
- Real-time chat with WebSocket
- Image upload for profiles and jobs
- GPS-based location search
- Push notifications
- Review and rating system implementation
- Technician verification system
- Job completion workflow
- Dispute resolution
