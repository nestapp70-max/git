# LabourConnect - Pure HTML/CSS/JavaScript Version

This is a complete standalone HTML/CSS/JavaScript application for LabourConnect marketplace.

## Files Included

1. **index.html** - Complete HTML structure with all forms and modals (193 lines)
2. **style.css** - All styling including dark theme with WhatsApp green (927 lines)
3. **app.js** - All JavaScript functionality (567 lines)

## Features

✓ OTP-based login/signup
✓ Search & filter technicians by location and category
✓ View technician profiles with work photos
✓ Post jobs and manage bids
✓ Wallet recharge system
✓ Contact unlock functionality (₹10)
✓ WhatsApp integration
✓ Voice search (Web Speech API)
✓ Dark theme optimized for low-end devices
✓ Responsive mobile-first design
✓ Two-panel dashboard layout

## How to Use

### Option 1: Use with Backend (Recommended - What you have now)
Your files are already set up to work with the Express backend:
```bash
npm run dev
```
Then open `http://localhost:5000/public/index.html`

### Option 2: Deploy These Files to GitHub Pages / Netlify / Vercel

1. Download these 3 files:
   - index.html
   - style.css
   - app.js

2. Upload to your hosting:
   - GitHub Pages: Create repo, enable Pages
   - Netlify: Drag & drop folder
   - Vercel: Import from GitHub

3. Update API URLs in app.js to point to your backend

### Option 3: Use with Local Server
```bash
# Python
python -m http.server 8000

# Or Node.js
npx http-server .
```

## API Endpoints Required

The app expects these API endpoints from your backend:

Authentication:
- `POST /api/auth/send-otp` - Send OTP code
- `POST /api/auth/verify-otp` - Verify OTP & login
- `POST /api/auth/signup` - Create new user

Users:
- `GET /api/users/:id` - Get user profile

Technicians:
- `GET /api/technicians` - List all technicians
- `GET /api/technicians/my-profile?userId={id}` - Get technician profile

Jobs:
- `GET /api/jobs/my-jobs?customerId={id}` - Get customer's jobs
- `POST /api/jobs` - Post new job

Wallet:
- `POST /api/wallet/recharge` - Add money to wallet

Chat Unlocks:
- `POST /api/chat-unlocks` - Unlock technician contact
- `GET /api/chat-unlocks/my-unlocks?customerId={id}` - Get unlocked contacts

## Testing Credentials

Phone: `9876543210` through `9876543216`
OTP: `123456` (logged to browser console in dev mode)

## Browser Support

- Chrome, Firefox, Safari, Edge (all modern versions)
- Requires JavaScript enabled
- Web Speech API for voice search (Chrome/Edge recommended)
- Mobile-optimized for iOS and Android

## Customization

### Change Colors (in style.css)
```css
:root {
  --primary: #06b39a;        /* WhatsApp green */
  --background: #0a0a0a;     /* Dark background */
  --card: #1a1a1a;           /* Card background */
  --text: #ffffff;           /* Text color */
}
```

### Change API URLs (in app.js)
Update fetch URLs if your backend is hosted elsewhere

## File Structure

```
public/
├── index.html        (HTML structure)
├── style.css         (All styling)
├── app.js            (All functionality)
└── README.md         (This file)
```

## Deployment Platforms

### Free Options
- **GitHub Pages** - Free hosting, great for static sites
- **Netlify** - Free tier with generous limits
- **Vercel** - Free, optimized for web apps

### Paid Options
- Traditional hosting (cPanel, FTP)
- AWS, Azure, Google Cloud
- DigitalOcean, Linode

## Important Notes

- All user data stored locally in browser (localStorage)
- Session persists across browser refreshes
- Requires backend API for full functionality
- No build process needed - pure vanilla JavaScript
- Fully responsive for all screen sizes (320px to 4K)

## How It Works

1. User opens index.html
2. JavaScript loads from app.js
3. Styling applied from style.css
4. App makes API calls to backend
5. Data stored in localStorage for persistence

## Troubleshooting

**App won't load:**
- Check browser console (F12) for errors
- Make sure backend is running
- Check API endpoints in app.js match your backend

**API calls failing:**
- Verify backend is running
- Check CORS settings on backend
- Verify API URLs in app.js are correct

**Login not working:**
- Check console for OTP code
- Make sure phone number is 10 digits
- Try phone numbers 9876543210-9876543216 for testing

## License

MIT License - Use freely in any project!

---

**Created:** November 2024
**Version:** 1.0
**Type:** Vanilla JavaScript (No frameworks)
