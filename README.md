# ProPerty Mobile (Expo)

React Native rewrite starter for the ProPerty app, built for Expo Go on iPhone.

## Included now

- Properties list screen
- Property details screen
- Tenancy add/edit screen
- Settings screen (currency, dark theme, API base URL)
- Upcoming contract end dates list
- Date picker for contract start and payment date
- No calendar grid layout

## Run locally

1. Start backend API from the root project:
   - `cd backend`
   - `node server.js`
2. Start mobile app:
   - `cd property-mobile`
   - `npm run start`
3. Open Expo Go on iPhone and scan the QR code.

## iPhone API access

`localhost` on iPhone points to the phone, not your PC. In app Settings, set API Base URL to your computer LAN IP:

- Example: `http://192.168.0.176:3000`

Your iPhone and PC must be on the same Wi-Fi network.

## Scripts

- `npm run start`
- `npm run ios`
- `npm run android`
- `npm run test`
- `npm run lint`
