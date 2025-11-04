# GitHub Pages Setup Guide

## 📖 How to Activate GitHub Pages for This Workflow

This guide explains **exactly** how to configure GitHub Pages to work with the GitHub Actions deployment workflow.

---

## 🎯 Prerequisites

Before setting up GitHub Pages:

1. ✅ Repository must be public (or you need GitHub Pro for private repos)
2. ✅ `.github/workflows/deploy.yml` file exists in your repository
3. ✅ Code is pushed to the `main` branch
4. ✅ First workflow run has completed successfully

---

## 📋 Step-by-Step Setup

### Step 1: Navigate to Repository Settings

1. Go to your GitHub repository
2. Click the **"Settings"** tab (⚙️ icon)

   ```
   https://github.com/YOUR_USERNAME/YOUR_REPO/settings
   ```

### Step 2: Open GitHub Pages Settings

1. In the left sidebar, scroll down to **"Code and automation"** section
2. Click **"Pages"**

   ```
   Settings → Pages
   ```

### Step 3: Configure Build and Deployment Source

This is the **most important step**:

1. Under **"Build and deployment"**
2. Find the **"Source"** dropdown
3. Select **"GitHub Actions"** (NOT "Deploy from a branch")

   ```
   Source: GitHub Actions  ← Select this option
   ```

   **Why GitHub Actions?**
   - Allows custom build processes
   - Works with TypeScript/Vite build
   - Automated deployment on push
   - Full control over build steps

### Step 4: Save Configuration

1. GitHub will automatically save when you select "GitHub Actions"
2. You'll see a message: "GitHub Pages is currently being built from GitHub Actions"

### Step 5: Verify Workflow Permissions

1. Still in **Settings**, go to **"Actions"** → **"General"**
2. Scroll to **"Workflow permissions"**
3. Ensure the following is selected:
   - ✅ **"Read and write permissions"**
   - ✅ **"Allow GitHub Actions to create and approve pull requests"** (optional but recommended)
4. Click **"Save"**

---

## 🚀 Triggering Your First Deployment

### Option A: Push to Main Branch

```bash
# Make any change (even a small one)
echo "# Deploy test" >> README.md

# Commit and push
git add .
git commit -m "Trigger GitHub Pages deployment"
git push origin main
```

### Option B: Manual Workflow Run

1. Go to the **"Actions"** tab in your repository
2. Click on **"Deploy to GitHub Pages"** workflow (left sidebar)
3. Click **"Run workflow"** button (right side)
4. Select **"main"** branch
5. Click green **"Run workflow"** button

---

## 🔍 Monitoring Deployment

### Watch the Workflow

1. Go to **"Actions"** tab
2. Click on the latest workflow run
3. Watch the progress:
   - **Build job**: TypeScript compilation, Vite build
   - **Deploy job**: Upload to GitHub Pages

### Expected Timeline

```
┌─────────────────┐
│ Build Job       │  ~2-3 minutes
│ - Checkout      │
│ - Install deps  │
│ - Type check    │
│ - Build         │
│ - Upload        │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ Deploy Job      │  ~30 seconds
│ - Deploy Pages  │
└─────────────────┘
         │
         ▼
    ✅ Success!
```

### Check Build Logs

If something fails:

1. Click on the failed workflow run
2. Click on **"build"** or **"deploy"** job
3. Expand the failed step
4. Read error messages
5. Fix issues and push again

---

## 🌐 Accessing Your Deployed Site

### Your GitHub Pages URL

Once deployment succeeds, your site will be available at:

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

**Example**:
- Username: `SolidRhino`
- Repo: `automaticinstall-GUI-Ubuntu`
- URL: `https://solidrhino.github.io/automaticinstall-GUI-Ubuntu/`

### Finding Your URL

1. Go to **Settings** → **Pages**
2. At the top, you'll see:
   ```
   Your site is live at https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
   ```
3. Click the link to visit your site

### Custom Domain (Optional)

If you have a custom domain:

1. In **Settings** → **Pages**
2. Under **"Custom domain"**
3. Enter your domain: `example.com`
4. Click **"Save"**
5. Configure DNS records with your domain provider

---

## ⚙️ Important Configuration

### Base Path in vite.config.ts

**Critical**: The base path must match your repository name.

**Current configuration** (in `vite.config.ts`):

```typescript
base: process.env.GITHUB_PAGES ? '/automaticinstall-GUI-Ubuntu/' : '/',
```

**If your repo name is different**:

```typescript
base: process.env.GITHUB_PAGES ? '/YOUR_REPO_NAME/' : '/',
//                                  ^^^^^^^^^^^^^^^^
//                                  Must match your repo name exactly!
```

**For custom domain or `username.github.io` repos**:

```typescript
base: '/',
```

### Update package.json Homepage

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
}
```

---

## 🔧 Troubleshooting

### Issue: "GitHub Pages" Not Showing in Source Dropdown

**Cause**: Repository settings may not have Actions enabled.

**Solution**:
1. Go to **Settings** → **Actions** → **General**
2. Under "Actions permissions", ensure Actions are enabled
3. Go back to **Settings** → **Pages**
4. "GitHub Actions" should now appear

---

### Issue: Workflow Runs But Site Shows 404

**Possible Causes & Solutions**:

#### 1. Wrong Base Path

**Check**: `vite.config.ts` base path

```typescript
// ❌ Wrong
base: '/'  // For GitHub Pages with repo, this won't work

// ✅ Correct
base: process.env.GITHUB_PAGES ? '/automaticinstall-GUI-Ubuntu/' : '/'
```

**Fix**: Update base path and redeploy

#### 2. Pages Not Configured

**Check**: Settings → Pages → Source

```
Source must be: GitHub Actions  (not "Deploy from a branch")
```

**Fix**: Change source to "GitHub Actions"

#### 3. Index.html Not Found

**Check**: Build output in workflow logs

```bash
# Should see:
dist/
  ├── index.html  ← Must exist
  ├── assets/
  └── ...
```

**Fix**: Ensure `vite build` generates index.html

---

### Issue: Assets (CSS/JS) Not Loading

**Symptom**: Page loads but no styling/functionality

**Cause**: Incorrect asset paths

**Solution**:

1. Open browser DevTools (F12)
2. Check Console for 404 errors
3. Verify asset URLs match base path
4. Update `vite.config.ts` base path
5. Rebuild and redeploy

---

### Issue: Deployment Permission Denied

**Error Message**:
```
Error: Resource not accessible by integration
```

**Cause**: Insufficient workflow permissions

**Solution**:
1. Settings → Actions → General
2. Workflow permissions
3. Select "Read and write permissions"
4. Save
5. Re-run workflow

---

### Issue: Build Fails on GitHub But Works Locally

**Possible Causes**:

#### 1. Node Version Mismatch

**Local**: You might use Node 18
**GitHub**: Workflow uses Node 20

**Solution**: Test locally with Node 20
```bash
nvm install 20
nvm use 20
npm run build
```

#### 2. Missing Dependencies

**Cause**: Dependencies in `devDependencies` but needed in production

**Solution**: Move to `dependencies` if needed
```bash
npm install --save package-name
```

#### 3. TypeScript Errors

**Cause**: Strict type checking in CI

**Solution**: Run type check locally
```bash
npm run type-check
```

---

## 📊 Workflow Status Badge

Add a status badge to your README:

```markdown
[![Deploy](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/deploy.yml)
```

Shows:
- ✅ Green: Last deployment succeeded
- ❌ Red: Last deployment failed
- 🟡 Yellow: Deployment in progress

---

## 🔄 Deployment Lifecycle

### Every Push to Main:

```
1. Developer pushes to main branch
         ↓
2. GitHub Actions detects push
         ↓
3. Workflow starts automatically
         ↓
4. Build job runs (install, type-check, build)
         ↓
5. Build artifact uploaded
         ↓
6. Deploy job runs (downloads artifact)
         ↓
7. Pages deployment completes
         ↓
8. Site live at github.io URL
         ↓
9. CloudFlare CDN distributes globally (~30s)
         ↓
10. ✅ Users see updated site
```

### Typical Timings:

- Workflow start: ~10 seconds after push
- Build job: ~2-3 minutes
- Deploy job: ~30 seconds
- CDN propagation: ~30 seconds
- **Total**: ~3-4 minutes from push to live

---

## 🎯 Best Practices

### 1. Test Before Merging

```bash
# Always test locally before pushing to main
npm run type-check  # Check for TypeScript errors
npm run build       # Ensure build succeeds
npm run preview     # Test the build output
```

### 2. Use Branch Protection

1. Settings → Branches
2. Add rule for `main`
3. Require status checks:
   - ✅ Build must pass
   - ✅ Type check must pass

### 3. Monitor Deployments

- Subscribe to workflow notifications
- Check status badge regularly
- Review failed deployments promptly

### 4. Keep Dependencies Updated

```bash
# Check for updates monthly
npm outdated

# Update dependencies
npm update

# Test after updates
npm run build
```

---

## 📚 Additional Resources

### GitHub Documentation

- [About GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)
- [GitHub Actions for Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)
- [Workflow Permissions](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)

### Vite & TypeScript

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## ✅ Verification Checklist

Before considering setup complete:

- [ ] Repository Settings → Pages → Source = "GitHub Actions"
- [ ] Workflow permissions = "Read and write permissions"
- [ ] `vite.config.ts` base path matches repo name
- [ ] First workflow run completed successfully
- [ ] Site accessible at `github.io` URL
- [ ] All pages load correctly (no 404s)
- [ ] CSS and JavaScript working
- [ ] Dark mode functioning
- [ ] PWA installable
- [ ] Mobile responsive

---

## 🎉 Success Indicators

You know everything is working when:

1. ✅ Actions tab shows green checkmarks
2. ✅ Settings → Pages shows "Your site is live at..."
3. ✅ Visiting the URL shows your app
4. ✅ Future pushes to main auto-deploy
5. ✅ Status badge in README shows passing

---

**Need Help?**

If you encounter issues not covered here:

1. Check GitHub Actions logs
2. Review browser console (F12)
3. Verify all configuration files
4. Test build locally
5. Check GitHub Pages status page

**Last Updated**: Created during TypeScript migration
