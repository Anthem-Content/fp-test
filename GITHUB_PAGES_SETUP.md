# GitHub Pages Deployment Setup (POC)

This guide will help you set up automated deployments to GitHub Pages - a simple, free hosting option perfect for POC testing.

## Why GitHub Pages for POC?

- **Free**: Unlimited for public repositories
- **No signup**: Uses your existing GitHub account
- **Simple URL**: `https://your-username.github.io/fp-test`
- **Automatic SSL**: HTTPS enabled by default
- **Zero config**: Just enable in repo settings

## Setup Steps

### 1. Enable GitHub Pages in Repository

1. Go to your **fp-test** GitHub repository
2. Click **Settings** (top navigation)
3. Click **Pages** in the left sidebar (under "Code and automation")
4. Under **Source**, select:
   - Source: **GitHub Actions** (NOT "Deploy from a branch")
5. Click **Save**

That's it! No API tokens, no account creation, no domain required.

### 2. Push the Workflow File

The workflow file has already been created at `.github/workflows/deploy-gh-pages.yml`.

Push it to GitHub:

```bash
git add .github/workflows/deploy-gh-pages.yml
git commit -m "Add GitHub Pages deployment workflow"
git push origin main
```

### 3. Monitor Deployment

1. Go to the **Actions** tab in your GitHub repository
2. You'll see "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (~2-4 minutes for first build)
4. When complete, you'll see a green checkmark ✅

### 4. Access Your Site

Your site will be available at:
```
https://YOUR-GITHUB-USERNAME.github.io/fp-test
```

**Example**: If your GitHub username is `jonsmith`, your site would be at:
```
https://jonsmith.github.io/fp-test
```

You can also find the URL in:
- **Settings** → **Pages** → "Your site is live at..."
- **Actions** → Click on workflow run → Deployment info

## How It Works

### Automatic Deployments

Every time you push to the `main` branch (including commits from the CMS):
1. GitHub Actions automatically triggers
2. Builds your Astro site
3. Deploys to GitHub Pages
4. Site updates in ~2-4 minutes

### Build Caching

The workflow includes two layers of caching:
1. **Node.js dependencies** - Cached based on `package-lock.json`
2. **Astro build artifacts** - Cached for incremental builds

**Expected build times:**
- First build: ~3-4 minutes
- Subsequent builds (cached): ~2-3 minutes
- Content-only changes: ~1-2 minutes

## Manual Deployment

You can also trigger deployments manually:

1. Go to **Actions** tab
2. Click **Deploy to GitHub Pages**
3. Click **Run workflow** → **Run workflow**

## Limitations (for POC)

- **Site size**: 1GB maximum (plenty for POC)
- **Bandwidth**: 100GB/month soft limit (fine for testing)
- **Build time**: Slower than Cloudflare (no edge caching)
- **Public repos only**: Private repos require GitHub Pro

These limitations won't affect POC testing, but keep them in mind for production.

## Custom Domain (Optional)

If you want to use a custom domain instead of `.github.io`:

1. Go to **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., `www.example.com`)
3. Add DNS records at your domain registrar:
   - For `www.example.com`: Add CNAME pointing to `your-username.github.io`
   - For apex domain: Add A records to GitHub's IPs (shown in settings)
4. Wait for DNS propagation (~5 minutes to 48 hours)

## Troubleshooting

### Build Fails

**Check build logs:**
1. Go to **Actions** tab
2. Click on the failed workflow
3. Expand the failed step to see error messages

**Common issues:**
- Missing dependencies: Run `npm install` locally and commit `package-lock.json`
- Build errors: Test `npm run build` locally first

### Site Shows 404

**Possible causes:**
1. Workflow still running - Wait for completion
2. GitHub Pages not enabled - Check Settings → Pages
3. Source set to "branch" instead of "GitHub Actions" - Change in Settings → Pages

### Deployment Permissions Error

If you see "Resource not accessible by integration":
1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Select **Read and write permissions**
4. Click **Save**

### Changes Not Appearing

- GitHub Pages can take 1-2 minutes to propagate after successful deployment
- Hard refresh your browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Check workflow completed successfully in Actions tab

## Switching to Cloudflare Later

When you're ready to move to production with Cloudflare Pages:

1. Disable GitHub Pages in Settings → Pages
2. Use the Cloudflare workflow instead (see `CLOUDFLARE_SETUP.md`)
3. Delete or rename `deploy-gh-pages.yml`

Your content and CMS will work identically - only the hosting changes.

## Support

- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Astro Deployment Guide**: https://docs.astro.build/en/guides/deploy/github/

## Estimated Setup Time

- Enable GitHub Pages: 1 minute
- Push workflow file: 1 minute
- First deployment: 3-4 minutes
- **Total: ~5 minutes**

Much faster than Cloudflare signup! 🚀
