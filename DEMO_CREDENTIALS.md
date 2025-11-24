# LabourConnect - Demo Credentials

## Quick Start: Login Demo Users

The app is pre-seeded with demo users. You can login with these credentials:

### Demo Customer Accounts
- **Phone**: `9876543210`
- **Phone**: `9876543211`

### Demo Technician Accounts
- **Phone**: `9876543212`
- **Phone**: `9876543213`
- **Phone**: `9876543214`
- **Phone**: `9876543215`
- **Phone**: `9876543216`

## How to Login

1. Go to **Login** page
2. Enter any of the phone numbers above (10-digit)
3. Click **Send OTP**
4. **In Development Mode**: OTP will appear in:
   - Server console logs
   - Response JSON (for testing)
5. Example OTP for testing: Check console or response
6. Enter OTP and verify
7. You're logged in!

## Twilio SMS Integration

To enable real SMS OTP sending:

### Get Twilio Credentials
1. Sign up at [twilio.com](https://www.twilio.com)
2. Go to Console → Account Info
3. Copy:
   - **Account SID**
   - **Auth Token**
   - **Phone Number** (in format: +1234567890)

### Set Environment Variables

Add these to your Replit secrets:

```
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

Or set as environment variables:
```bash
export TWILIO_ACCOUNT_SID="your_account_sid"
export TWILIO_AUTH_TOKEN="your_auth_token"
export TWILIO_PHONE_NUMBER="+1234567890"
```

### How It Works

- **Development Mode** (without Twilio):
  - OTP is logged to console
  - OTP is returned in API response for testing
  - No SMS sent

- **With Twilio Configured**:
  - OTP is sent via real SMS
  - User receives code on their phone
  - Console shows "✓ OTP sent to {phone} via SMS"

## Test OTP Codes

Since Twilio requires real phone numbers, for testing purposes:

1. Use Twilio's Trial account (limited SMS credits)
2. Use Twilio Test Credentials (sandbox mode)
3. Or use the demo accounts above without SMS for testing the UI flow

## Demo User Details

### Customer: Rajesh Kumar
- **Phone**: 9876543210
- **Wallet**: ₹500.00
- Can browse technicians, post jobs, unlock contacts

### Customer: Priya Sharma
- **Phone**: 9876543211
- **Wallet**: ₹300.00
- Can browse technicians, post jobs, unlock contacts

### Technician: Ramesh Patel (Electrician)
- **Phone**: 9876543212
- **Skills**: Electrician, AC Repair, Wiring
- **Experience**: 8 years
- **Rating**: 4.7/5 (23 reviews)
- **Location**: Mumbai, Maharashtra

### Technician: Suresh Verma (Plumber)
- **Phone**: 9876543213
- **Skills**: Plumber, Pipe Fitting, Water Tank Repair
- **Experience**: 5 years
- **Rating**: 4.9/5 (45 reviews)
- **Location**: Delhi NCR

### Technician: Amit Singh (Carpenter)
- **Phone**: 9876543214
- **Skills**: Carpenter, Furniture Making, Wood Polishing
- **Experience**: 12 years
- **Rating**: 4.8/5 (67 reviews)
- **Location**: Bangalore, Karnataka

### Technician: Vijay Kumar (Painter)
- **Phone**: 9876543215
- **Skills**: Painter, Wall Painting, POP Work
- **Experience**: 6 years
- **Rating**: 4.6/5 (34 reviews)
- **Location**: Pune, Maharashtra

### Technician: Mohammed Rizwan (Mason)
- **Phone**: 9876543216
- **Skills**: Mason, Tile Work, Plastering
- **Experience**: 10 years
- **Rating**: 4.7/5 (52 reviews)
- **Location**: Hyderabad, Telangana

## Testing Features

### As a Customer
1. **Browse Technicians**: Filter by category and location
2. **Unlock Contact**: Click "Unlock Contact" button → Confirm → ₹10 deducted
3. **Post Job**: Click "Post New Job" → Fill details → Submit
4. **Recharge Wallet**: Click wallet balance → Enter amount → Mock payment

### As a Technician
1. **Browse Jobs**: See all open/available jobs
2. **Place Bid**: Click "Bid Now" on a job → Enter amount and message
3. **View Bids**: Go to "My Bids" tab → See bid status

## Troubleshooting

### OTP Not Appearing
- Check browser console for errors
- Check server logs: `[OTP] Code for {phone}: {code}`
- Make sure you're entering the correct phone number

### Twilio SMS Not Sending
- Verify all credentials are set correctly
- Check server logs for "✓ Twilio initialized" message
- Ensure phone number is in format: `+91XXXXXXXXXX` (with country code)
- Check Twilio account balance and limits

### Login Not Working
- Verify phone number is 10 digits
- Check that user exists in database
- OTP must be entered within 10 minutes
- OTP is single-use only
