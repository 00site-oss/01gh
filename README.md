# 01GH Rewards – React Frontend

Modern React (Vite) rewrite of the 01GH single-file HTML app.

## Features
- Modular `.jsx` components and pages
- Admin panel protected behind `ProtectedAdmin` route (only visible to `isAdmin` users)
- Auth context + session token in localStorage
- Same visual design (CSS extracted from original)
- Ready for GitHub

## Important Notes about Backend
The original frontend used `google.script.run` which only works when the HTML is served by Google Apps Script.

This React version includes a fallback `fetch` call to the provided Apps Script web app URL.  
**Google Apps Script web apps have strict CORS rules.** For production you should either:

1. Keep the React build and serve it from Apps Script (possible but more work), or
2. Add a simple proxy / use Apps Script `doPost` that returns proper CORS headers, or
3. Run the frontend on the same domain.

The API layer is in `src/utils/api.js` – update `EXEC_URL` if needed.

## Setup

```bash
cd 01gh-react
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

The `dist/` folder can be deployed to GitHub Pages, Vercel, Netlify, etc.

## Project Structure

```
src/
  components/     # Layout, Chat, AuthModal, DailyModal, ProtectedAdmin
  pages/          # Earn, Shop, Leaders, Profile, Help, Admin, Tos, Privacy
  context/        # AppContext (auth + shared state)
  utils/          # api.js
  styles/         # global.css (original styles)
```

Admin is fully separated: route is `/admin` and wrapped in `ProtectedAdmin` which redirects non-admins.
