# Cloudflare Pages Deployment Setup

This guide will help you set up automated deployments to Cloudflare Pages using GitHub Actions.

## Why Cloudflare Pages?

- **Free tier**: Unlimited bandwidth, 500 builds/month
- **Performance**: Global CDN with 285+ cities
- **Build caching**: Automatic caching for fast deployments (~1-2 minutes)
- **Zero config**: Native Astro support
- **Cost**: $0/month for this project

## Setup Steps

### 1. Create Cloudflare Account

1. Go to https://dash.cloudflare.com/sign-up
2. Sign up with your email
3. Verify your email address

### 2. Create Pages Project

1. In Cloudflare Dashboard, click **Pages** in the left sidebar
2. Click **Create a project**
3. Click **Connect to Git**
4. Authorize Cloudflare to access your GitHub account (one-time)
5. Select your repository: **fp-test**
6. Configure build settings:
   - **Project name**: `fp-test` (or choose your own)
   - **Production branch**: `main`
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty)
   - **Environment variables**: None needed for now
7. Click **Save and Deploy**

> **Note**: The first deployment via the Cloudflare dashboard will fail or succeed, but subsequent deployments will be handled by GitHub Actions.

### 3. Get API Credentials

#### Get API Token

1. Go to **My Profile** (top right avatar) → **API Tokens**
2. Click **Create Token**
3. Click **Use template** next to **Edit Cloudflare Workers**
4. Or click **Create Custom Token** and set these permissions:
   - **Account** → **Cloudflare Pages** → **Edit**
5. Set **Account Resources**:
   - Include → Your account
6. Click **Continue to summary**
7. Click **Create Token**
8. **IMPORTANT**: Copy the token immediately (you won't see it again!)

#### Get Account ID

1. Go to **Pages** dashboard
2. Click on your **fp-test** project
3. Look at the URL in your browser:
   ```
   https://dash.cloudflare.com/{ACCOUNT_ID}/pages/view/fp-test
   ```
4. Copy the `ACCOUNT_ID` from the URL (it's a long hexadecimal string)

### 4. Add GitHub Secrets

1. Go to your **fp-test** GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these two secrets:

#### Secret 1: CLOUDFLARE_API_TOKEN
- **Name**: `CLOUDFLARE_API_TOKEN`
- **Value**: Paste the API token from step 3
- Click **Add secret**

#### Secret 2: CLOUDFLARE_ACCOUNT_ID
- **Name**: `CLOUDFLARE_ACCOUNT_ID`
- **Value**: Paste your Account ID from step 3
- Click **Add secret**

### 5. Update Workflow File (If Needed)

The workflow file `.github/workflows/deploy.yml` is already configured with:
- **Project name**: `fp-test`

If you chose a different project name in step 2, update line 73:
```yaml
projectName: 'your-project-name-here'
```

### 6. Test Deployment

#### Option A: Push to Main Branch
```bash
git add .
git commit -m "Add Cloudflare Pages deployment workflow"
git push origin main
```

#### Option B: Trigger Manually
1. Go to **Actions** tab in GitHub
2. Click **Deploy to Cloudflare Pages**
3. Click **Run workflow** → **Run workflow**

### 7. Monitor Deployment

1. Go to **Actions** tab in your GitHub repository
2. Click on the running workflow
3. Watch the build progress
4. When complete, you'll see:
   ```
   ✅ Deployment successful!
   🌐 URL: https://fp-test.pages.dev
   ```

### 8. Access Your Site

Your site will be available at:
- **Production**: `https://fp-test.pages.dev`
- **Custom domain** (optional, see below)

## Performance Expectations

### Build Times

**First build** (no cache):
- Install dependencies: ~2-3 minutes
- Build Astro site: ~30-60 seconds
- Deploy to Cloudflare: ~20-30 seconds
- **Total: ~3-4 minutes**

**Subsequent builds** (with cache):
- Restore dependencies: ~10-20 seconds
- Build Astro site: ~30-60 seconds
- Deploy to Cloudflare: ~20-30 seconds
- **Total: ~1-2 minutes**

**Content-only changes** (from CMS):
- Astro incremental build
- **Total: <1 minute**

## Caching Strategy

The workflow includes three layers of caching:

1. **Node.js dependency cache** - Caches `node_modules` based on `package-lock.json`
2. **Astro build cache** - Caches `.astro` directory for incremental builds
3. **Cloudflare Pages cache** - Automatic caching by Cloudflare

## Optional: Custom Domain

### Add Custom Domain

1. In Cloudflare Pages dashboard, go to your project
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter your domain (e.g., `www.example.com`)
5. Follow the DNS setup instructions

### DNS Configuration

If your domain is **on Cloudflare**:
- DNS records are added automatically

If your domain is **elsewhere**:
- Add a CNAME record:
  - **Name**: `www` (or `@` for apex)
  - **Value**: `fp-test.pages.dev`

## Preview Deployments

When you create a pull request:
- A preview deployment is automatically created
- URL is posted as a comment on the PR
- Each commit updates the preview
- Production deploys only on merge to main

## Troubleshooting

### Build Fails

**Check build logs**:
1. Go to **Actions** tab in GitHub
2. Click on the failed workflow
3. Expand **Build Astro site** step
4. Look for error messages

**Common issues**:
- Missing dependencies: Run `npm install` locally and commit `package-lock.json`
- Build errors: Test `npm run build` locally
- Environment variables: Add them in GitHub Secrets

### Deployment Fails

**Check secrets**:
- Verify `CLOUDFLARE_API_TOKEN` is correct
- Verify `CLOUDFLARE_ACCOUNT_ID` is correct
- Verify token has **Cloudflare Pages → Edit** permission

**Check project name**:
- Verify `projectName` in workflow matches your Cloudflare Pages project name

### Slow Builds

**Check cache status**:
- Look for "Cache hit" vs "Cache miss" in Actions logs
- First build is always slower (cold cache)
- Subsequent builds should be 2-3x faster

## Rollback to Previous Deployment

If a deployment breaks your site:

1. Go to Cloudflare Pages dashboard
2. Click **Deployments** tab
3. Find the last working deployment
4. Click **...** → **Rollback to this deployment**

## Cost Monitoring

### Free Tier Limits
- **Builds**: 500 per month (plenty for CMS usage)
- **Bandwidth**: Unlimited
- **Requests**: Unlimited
- **Build time**: 20 minutes per build

### Monitoring Usage
1. Cloudflare Dashboard → **Pages** → **fp-test**
2. View deployment history and build times

## Next Steps

After successful deployment:
- [ ] Test your site at the Cloudflare Pages URL
- [ ] Configure custom domain (optional)
- [ ] Test CMS commits trigger automatic deployments
- [ ] Set up branch protection rules (recommended)

## Support

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Astro Docs**: https://docs.astro.build/

## Estimated Total Time

- Account setup: 5 minutes
- API credentials: 5 minutes
- GitHub secrets: 2 minutes
- First deployment: 5 minutes
- **Total: ~20 minutes**
