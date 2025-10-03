# BoloBhai

Anonymous college-focused gossip/confession webapp.

## Quick Start (like instructions for a 10-year-old)

1. Install Node.js 20 from the official website.
2. Open a terminal and run:
   - `git clone YOUR_REPO_URL`
   - `cd bolobhai`
3. Copy the example settings:
   - `cp env.local.example .env.local` (on Windows, copy the file and rename it)
4. Open `.env.local` and paste your values from Supabase and Admin:
   - `SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_USER`, `ADMIN_PASSWORD`, `JWT_SECRET`
   - `NEXT_PUBLIC_BASE_URL` = `http://localhost:3000`
5. Install packages: `npm install`
6. Build: `npm run build`
7. Start: `npm run start`
8. Open your browser to `http://localhost:3000`

Admin login page: go to `/admin/login`. Use the admin username/password you put in `.env.local`.

## Deploy to Vercel

1. Push this project to GitHub.
2. Go to the Vercel dashboard and create a new project.
3. When asked for Environment Variables, add the following names with your values:
   - `SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL` (same as above)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `ADMIN_USER`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_BASE_URL` = your deployed domain URL
4. Deploy. After deploy, visit `/admin/login` and enter your admin credentials.

## Database

- Connect to Supabase and run the SQL in `supabase/schema.sql`.

## Tests and CI

- Run tests: `npm test`
- GitHub Actions in `.github/workflows/ci.yml` will typecheck, lint, build, and test on every push.

## Security Notes

- No real keys are in this repo. Keep your secrets in env vars.
- Admin endpoints are server-only and protected by an HTTP-only cookie.

## License

MIT


