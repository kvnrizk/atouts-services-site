# Deploying atoutservice92.fr

Architecture: **Vercel** (Next.js site, `atousservice-next`) → **Render, Frankfurt** (NestJS API + PostgreSQL, `atousservice_backend`) → **OVH Object Storage** (photos uploaded from the admin). Domain and DNS at **OVH**.

Do the steps in this order: the site build reads the API, so the API must be online first.

## 0. Put both repos on GitHub (private)

Vercel and Render deploy from GitHub. Create two **private** repos, then in each project folder:

```
git remote add origin https://github.com/<account>/<repo>.git
git push -u origin redesign
```

Deploy from the `redesign` branch, or merge it into `master` first and deploy `master`.

## 1. Photo storage: OVH Object Storage

Render's disk is wiped at every deploy, so photos uploaded from the admin must live in a bucket.

1. OVH Control Panel → **Public Cloud** → create a project (billed per use).
2. **Object Storage** → **Create a container** → S3 API, **Standard**, region **Gravelines (GRA)**. Name: `atouts-services-photos`.
3. **Users** → create an S3 user with the ObjectStore operator role → note the **access key** and **secret key** (shown once).

The photos are made public one by one when uploaded (`S3_OBJECT_ACL=public-read`); the bucket itself stays private (nobody can list it).

## 2. Database + API on Render (region Frankfurt)

1. **New → PostgreSQL**: name `atouts-db`, region Frankfurt, plan **Basic** (the free plan is deleted after 30 days).
2. **New → Web Service** from the `atousservice_backend` repo: region Frankfurt, runtime **Docker** (the repo has a Dockerfile), plan **Starter** (the free plan sleeps: the admin and new pages would take ~1 min to wake up).
3. Environment variables:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | the database's **Internal** URL (Render → atouts-db → Connect) |
| `DATABASE_SSL` | `no-verify` (if the logs say "server does not support SSL", use `disable`) |
| `JWT_SECRET` | 64+ random characters: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRATION` | `7d` |
| `FRONTEND_URL` | `https://www.atoutservice92.fr,https://atoutservice92.fr` (first one = used in email links) |
| `ADMIN_EMAIL` | `atouts.services92@gmail.com` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | from the email provider (step 5); leave empty until then |
| `ANALYTICS_INGEST_KEY` | random secret, **same value on Vercel** |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | OVH S3 user (step 1) |
| `S3_BUCKET` | `atouts-services-photos` |
| `S3_REGION` | `gra` |
| `S3_ENDPOINT` | `https://s3.gra.io.cloud.ovh.net` |
| `S3_OBJECT_ACL` | `public-read` |
| `S3_CDN_URL` | `https://atouts-services-photos.s3.gra.io.cloud.ovh.net` |

Do **not** set `TYPEORM_SYNCHRONIZE`: at startup the API runs `src/migrations`, which creates every table.

4. Deploy. Check `https://<service>.onrender.com/blog` answers `{"data":[]...}`.
5. Custom domain: Render → Settings → Custom Domains → `api.atoutservice92.fr` (DNS in step 4).

## 3. Copy today's content to production

From `atousservice_backend/`, with Docker running (uses the **External** database URL from Render):

```
.\scripts\copy-content-to-prod.ps1 -ProdUrl "<External Database URL>"
```

Copies blog articles, city pages, reviews and replaced site photos (published/draft state kept). Quotes, analytics and users are not copied. Safe to run twice.

Create the admin account on production (choose a **new** password):

```
$env:DATABASE_URL="<External Database URL>"; $env:DATABASE_SSL="no-verify"; $env:TYPEORM_SYNCHRONIZE="false"; npm run create:admin
```

Then close that PowerShell window (it holds the production URL).

Photos (blog covers, site photos, logo) are files in `public/` and ship with the site. Nothing to upload.

## 4. Site on Vercel (plan Pro: the Hobby plan is for non-commercial use)

1. **Add New → Project** from the `atousservice-next` repo (Framework: Next.js, detected).
2. Environment variables (Production):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://api.atoutservice92.fr` |
| `API_URL` | `https://api.atoutservice92.fr` |
| `API_HOSTNAME` | `api.atoutservice92.fr` |
| `CDN_HOSTNAME` | `atouts-services-photos.s3.gra.io.cloud.ovh.net` |
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

- Log in at `https://www.atoutservice92.fr/admin`, then check the blog, city pages, a quote form (does the email arrive?), and a photo upload in Portfolio (the photo URL must start with `https://atouts-services-photos…`).
- Google Search Console: add the domain, submit `https://www.atoutservice92.fr/sitemap.xml`.
- Still to fill in `lib/legal.ts`: AXA address and policy number, share capital, RM number, host addresses.
- Render database backups: the paid plan keeps daily backups. Check they are enabled.
