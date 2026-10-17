# Deployment Checklist: Fashion Hub Preview

> **IMPORTANT: Temporary Preview Notice**
> - **Free PostgreSQL Expiring**: Render Free tier PostgreSQL databases expire automatically **30 days** after creation (with a 14-day grace period before deletion).
> - **Free Web Service Sleep**: Render free web services spin down after 15 minutes of inactivity, resulting in a 50+ second cold start delay on wake-up.
> - **Test Transactions Only**: This deployment is strictly for preview and testing. Keep Razorpay in **Test Mode**. **No real orders or payments should be accepted.**

---

## 1. Render Blueprint Setup (API & Database)

1. Sign in to the **Render Dashboard**.
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository (`my-fashionhub-ecommerce-website`) and select the `deploy-preview` branch (or `main` after merging).
4. Render will detect `render.yaml` and prompt you for the following environment variables:
   - `NEXTAUTH_URL`: Enter your expected Netlify URL (e.g. `https://<your-site-name>.netlify.app`).
   - `CORS_ORIGIN`: Enter the exact Netlify origin (e.g. `https://<your-site-name>.netlify.app` with **no trailing slash**).
   - `RAZORPAY_KEY_ID`: Your Razorpay Test Mode Key ID (`rzp_test_...`).
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Test Mode Key Secret.
   - `RAZORPAY_WEBHOOK_SECRET`: Your Razorpay Webhook Secret.
   *(Note: `DATABASE_URL` is automatically configured by Render from `fashion-hub-postgres`, and `NEXTAUTH_SECRET` is generated automatically).*
5. Click **Apply**. Render will provision:
   - `fashion-hub-postgres` (PostgreSQL Database)
   - `fashion-hub-api` (Web Service running Prisma migrations and Next.js backend)

---

## 2. Obtain Render Service Origin & External DB URL

1. **Backend Service Origin**:
   - In the Render Dashboard, open the `fashion-hub-api` service.
   - Copy the service URL shown at the top (e.g. `https://fashion-hub-api-xxxx.onrender.com`).
   - Test health check: open `https://<service-url>/api/health` in your browser. It should return:
     ```json
     {"status":"ok","database":"connected"}
     ```
2. **External Database URL (Optional - For Initial Data/Seeding)**:
   - In the Render Dashboard, open the `fashion-hub-postgres` database.
   - Click the **Connect** button and copy the **External Database URL**.
   - To seed the initial 50-product catalog from your local terminal:
     ```powershell
     $env:DATABASE_URL = "<External Database URL>"
     npx prisma db seed
     Remove-Item Env:DATABASE_URL
     ```
   - Or to migrate existing SQLite data:
     ```powershell
     $env:DATABASE_URL = "<External Database URL>"
     $env:SQLITE_SOURCE_URL = "file:../dev.db"
     npm run db:migrate:sqlite-to-postgres
     Remove-Item Env:DATABASE_URL
     Remove-Item Env:SQLITE_SOURCE_URL
     ```

---

## 3. Netlify Frontend Setup

1. Sign in to the **Netlify Dashboard**.
2. Click **Add new site** → **Import an existing project** → **GitHub**.
3. Select `my-fashionhub-ecommerce-website` and the deployment branch.
4. Build configuration:
   - **Build command**: `npm run build`
   - **Publish directory**: Leave blank / default (Netlify automatically detects Next.js OpenNext).
5. Add the following **Environment Variables** in **Site configuration** → **Environment variables**:
   - `API_PROXY_ORIGIN`: Your actual Render service origin from Step 2 (e.g. `https://fashion-hub-api-xxxx.onrender.com`, HTTPS, no trailing slash).
   - `NEXTAUTH_URL`: Your Netlify site URL (e.g. `https://<site-name>.netlify.app`).
   - `NEXTAUTH_SECRET`: The exact secret string generated for `NEXTAUTH_SECRET` in the Render `fashion-hub-api` environment settings.
   - *(Optional)* `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Your public Razorpay test key ID (`rzp_test_...`).
   > **DO NOT** add `DATABASE_URL`, `RAZORPAY_KEY_SECRET`, or `RAZORPAY_WEBHOOK_SECRET` to Netlify.
6. Click **Deploy Site**.

---

## 4. Final Sync: Update URLs on Render

Once your Netlify site is deployed and its final URL is known:
1. Go to the **Render Dashboard** → `fashion-hub-api` → **Environment**.
2. Verify or update:
   - `NEXTAUTH_URL` = `https://<your-actual-site>.netlify.app`
   - `CORS_ORIGIN` = `https://<your-actual-site>.netlify.app` (no trailing slash)
3. Click **Save Changes** and trigger a **Manual Deploy** → **Deploy latest commit** on Render so the new origin is active.
4. Open the Netlify site in your browser to verify:
   - Catalog loading and product pages
   - User registration and login
   - Cart, wishlist, and checkout with Razorpay Test Mode
