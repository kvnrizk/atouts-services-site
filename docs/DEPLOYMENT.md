# Deploying atoutservice92.fr

Architecture (free plans): **Vercel** (Next.js site, repo `atouts-services-site`) → **Render, Frankfurt, Free** (NestJS API, repo `atouts-services-api`) → **Neon, Frankfurt** (PostgreSQL, created from Vercel → Storage) + **Cloudinary** (photos uploaded from the admin). Domain and DNS at **OVH**.

Do the steps in this order: the site build reads the API, so the API must be online first.

## 0. Put both repos on GitHub (private)

Vercel and Render deploy from GitHub. Create two **private** repos, then in each project folder:

```
git remote add origin https://github.com/<account>/<repo>.git
git push -u origin redesign
```

Deploy from the `redesign` branch, or merge it into `master` first and deploy `master`.

## 1. Photo storage: Cloudinary (free plan)

Render's disk is wiped at every deploy, so photos uploaded from the admin go to Cloudinary.

1. Sign up at cloudinary.com (free plan, no payment method).
2. Dashboard → **API Keys** (or "Product environment settings") → copy the **API environment variable**: `cloudinary://<api_key>:<api_secret>@<cloud_name>`.
3. Photos are stored in the `atouts-services` folder of the Media Library.

## 2. Database (Neon) + API (Render, Frankfurt)

1. Vercel → **Storage** → **Create Database** → **Neon** → region Frankfurt, Free plan, name `atouts-db` → **Skip** the "Connect a Project" step. Copy `DATABASE_URL_UNPOOLED` (direct connection, needed for the migrations).
2. Render → **+ New → Web Service** from `atouts-services-api`: region Frankfurt, runtime **Docker**, plan **Free**.
3. Environment variables:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Neon `DATABASE_URL_UNPOOLED` |
| `DATABASE_SSL` | `verify` |
| `JWT_SECRET` | 64+ random characters: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRATION` | `7d` |
| `FRONTEND_URL` | `https://www.atoutservice92.fr,https://atoutservice92.fr` (first one = used in email links) |
| `ADMIN_EMAIL` | `atouts.services92@gmail.com` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | from the email provider (step 5); leave empty until then |
| `ANALYTICS_INGEST_KEY` | random secret, **same value on Vercel** |
| `CLOUDINARY_URL` | the Cloudinary API environment variable (step 1) |

Do **not** set `TYPEORM_SYNCHRONIZE`: at startup the API runs `src/migrations`, which creates every table.

4. Deploy. Check `https://<service>.onrender.com/blog` answers `{"data":[]...}`.
5. The free plan sleeps after 15 min without requests. Keep it awake with a free job on **cron-job.org** calling `https://<service>.onrender.com/` every 10 minutes.
6. Custom domain: Render → Settings → Custom Domains → `api.atoutservice92.fr` (DNS in step 4).

## 3. Copy today's content to production

From `atousservice_backend/`, with Docker running (uses the Neon `DATABASE_URL_UNPOOLED`):

```
.\scripts\copy-content-to-prod.ps1 -ProdUrl "<Neon DATABASE_URL_UNPOOLED>"
```

Copies blog articles, city pages, reviews and replaced site photos (published/draft state kept). Quotes, analytics and users are not copied. Safe to run twice.

Create the admin account on production (choose a **new** password):

```
$env:DATABASE_URL="<Neon DATABASE_URL_UNPOOLED>"; $env:DATABASE_SSL="verify"; $env:TYPEORM_SYNCHRONIZE="false"; npm run create:admin
```

Then close that PowerShell window (it holds the production URL).

Photos (blog covers, site photos, logo) are files in `public/` and ship with the site. Nothing to upload.

## 4. Site on Vercel (note: the free Hobby plan is officially for non-commercial use; Pro is $20/month)

1. **Add New → Project** from the `atousservice-next` repo (Framework: Next.js, detected).
2. Environment variables (Production):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://api.atoutservice92.fr` |
| `API_URL` | `https://api.atoutservice92.fr` |
| `API_HOSTNAME` | `api.atoutservice92.fr` |
| `ANALYTICS_INGEST_KEY` | same as Render |
| `ANALYTICS_SALT_SECRET` | another random secret |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | later, when Google Ads is set up |

3. Settings → Domains: add `www.atoutservice92.fr` (main) and `atoutservice92.fr` (redirects to www). Vercel shows the DNS records to create.
4. OVH → Domains → atoutservice92.fr → **DNS zone**:
   - `atoutservice92.fr` **A** → the IP Vercel shows (usually `76.76.21.21`)
   - `www` **CNAME** → the value Vercel shows (usually `cname.vercel-dns.com.`)
   - `api` **CNAME** → `<service>.onrender.com.`
   - remove any older A/CNAME on the same names (OVH parking page).
5. Redeploy on Vercel once the API answers on `https://api.atoutservice92.fr`.

Until the domain is live, the API can be tested with the `onrender.com` address: put it in the three API variables and add the `*.vercel.app` address to `FRONTEND_URL` on Render.

## 5. Emails

- OVH → Emails: create `contact@atoutservice92.fr` with a redirection to the Gmail.
- Sending (quote notifications): an SMTP provider (Brevo or Resend) with `noreply@atoutservice92.fr`, plus the SPF, DKIM and DMARC records it gives, in the OVH DNS zone. Fill the SMTP variables on Render.
- Fill the email provider in `lib/legal.ts`.

## 6. After launch

- Log in at `https://www.atoutservice92.fr/admin`, then check the blog, city pages, a quote form (does the email arrive?), and a photo upload in Portfolio (the photo URL must start with `https://res.cloudinary.com/`).
- Google Search Console: add the domain, submit `https://www.atoutservice92.fr/sitemap.xml`.
- Still to fill in `lib/legal.ts`: AXA address and policy number, share capital, RM number, host addresses.
- Database backups: Neon free keeps a short restore window. Before big changes, run a manual `pg_dump` of the Neon database.
