# GitHub Pages Deployment Instructions

## Quick Start Deployment

### Prerequisites

- GitHub account
- Git installed on your machine
- Repository created (or about to create one)

## Step-by-Step Deployment

### 1. Initialize Git Repository

```bash
cd /Users/jlmg/Documents/repos/aion

# If not already a git repo
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Calendar Event Parser"

# Rename branch to main if needed
git branch -M main
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `aion` (or your preferred name)
3. Description: "Calendar Event Parser - Filter events by custom text patterns"
4. Choose Public (required for free GitHub Pages)
5. Click "Create repository"

### 3. Connect Local Repo to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/aion.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 4. Enable GitHub Pages

1. Go to your repository: `https://github.com/YOUR_USERNAME/aion`
2. Click **Settings** (gear icon)
3. In the left sidebar, click **Pages**
4. Under "Build and deployment":
   - Source: Select "Deploy from a branch"
   - Branch: Select `gh-pages`
   - Folder: Select `/ (root)`
5. Click **Save**

The `gh-pages` branch will be created automatically by the GitHub Actions workflow.

### 5. Automatic Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:

- Automatically trigger when you push to `main` branch
- Build the Angular app
- Deploy to `gh-pages` branch
- Your site will be live at: `https://YOUR_USERNAME.github.io/aion/`

### First Deployment

After pushing to GitHub:

```bash
git push origin main
```

Then:

1. Go to **Actions** tab in your repository
2. Watch the "Deploy to GitHub Pages" workflow
3. Wait for it to complete (usually 2-3 minutes)
4. Your app will be available at `https://YOUR_USERNAME.github.io/aion/`

## How the Workflow Works

The `.github/workflows/deploy.yml` file:

```yaml
- Triggers on push to main branch
- Sets up Node.js 18 environment
- Installs dependencies (npm ci)
- Builds with: npm run build:github
  ├── Sets correct base href for GitHub Pages (/aion/)
  └── Creates optimized production build
- Deploys to gh-pages branch using peaceiris/actions-gh-pages
```

The `build:github` script in `package.json`:

```json
"build:github": "ng build --configuration production --base-href=/aion/"
```

This ensures:

- Assets load correctly from `/aion/` subdirectory
- All links and routes work properly
- CSS, JS, and images are found correctly

## Updating the Live Site

After deployment is set up, updates are automatic:

1. Make changes locally
2. Commit: `git commit -m "Your message"`
3. Push: `git push origin main`
4. GitHub Actions automatically deploys within 2-3 minutes
5. Check Actions tab to monitor deployment

## Troubleshooting

### Workflow Fails with "No gh-pages branch"

First deployment might fail because `gh-pages` doesn't exist yet:

1. Go to **Settings** > **Pages**
2. Make sure source is set to "Deploy from a branch"
3. Select `gh-pages` branch (will be created by workflow)
4. Push again: `git push origin main`

The workflow will create the branch on first run.

### Site Not Updating

Check the following:

1. **Verify Actions Status**
   - Go to Actions tab
   - Check if latest workflow succeeded (green checkmark)
   - Click on failed workflow for error details

2. **Clear Browser Cache**
   - Force refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Or use private/incognito window

3. **Check GitHub Pages Settings**
   - Settings > Pages
   - Source should be "Deploy from a branch"
   - Branch should be `gh-pages`
   - Folder should be `/ (root)`

4. **Wait for Cache to Clear**
   - GitHub Pages can take 2-5 minutes to update
   - Check after 5 minutes if still not updated

### Workflow Errors

Check the Actions tab for details:

1. Go to **Actions** tab
2. Click on the failed workflow
3. Click on "Deploy to GitHub Pages" job
4. Scroll down to see error logs

Common issues:

- Node version mismatch (we use 18)
- Missing dependencies (run `npm install` locally)
- Build errors (check `npm run build:github` locally)

## Manual Deployment (Alternative)

If you prefer not to use GitHub Actions:

```bash
# Build for GitHub Pages
npm run build:github

# Install gh-pages package
npm install -g gh-pages

# Deploy dist folder to gh-pages branch
npx gh-pages -d dist/calendar-parser
```

Then enable GitHub Pages with `gh-pages` branch as source.

## Custom Domain (Optional)

To use a custom domain like `calendar.example.com`:

1. Create a `CNAME` file in `public/` with your domain
2. Configure DNS settings at your domain provider
3. Update GitHub Pages settings to use custom domain
4. GitHub will handle SSL automatically

## Environment URLs

After successful deployment:

| Environment  | URL                                   |
| ------------ | ------------------------------------- |
| Local Dev    | http://localhost:4200                 |
| GitHub Pages | https://YOUR_USERNAME.github.io/aion/ |

## Monitoring Deployments

### GitHub Actions Dashboard

Visit: `https://github.com/YOUR_USERNAME/aion/actions`

You can see:

- Deployment history
- Success/failure status
- Build logs
- Timing information

### About Page Caching

GitHub Pages caches aggressively. If changes don't appear:

1. Wait 5 minutes
2. Hard refresh browser (Cmd+Shift+R on Mac)
3. Try in incognito/private window
4. Check browser DevTools network tab (disable cache)

## Rollback Procedures

To revert to a previous version:

```bash
# View commit history
git log --oneline

# Reset to previous commit
git reset --hard <commit-hash>

# Force push to main
git push origin main --force

# GitHub Actions will redeploy automatically
```

## Security Notes

- GitHub Pages with free accounts requires public repositories
- All code is publicly visible
- Keep sensitive keys/tokens in GitHub Secrets, not in code
- Use environment variables for API keys (when integrating Gmail)

## Success Checklist

- [ ] Repository created on GitHub
- [ ] Local code pushed to `main` branch
- [ ] GitHub Pages enabled with `gh-pages` source
- [ ] First deployment completed (check Actions tab)
- [ ] Site accessible at `https://YOUR_USERNAME.github.io/aion/`
- [ ] App loads and displays events correctly
- [ ] Test calendars and patterns work as expected
- [ ] Deployment workflow runs automatically on future pushes

## Support Resources

- GitHub Pages Documentation: https://pages.github.com
- GitHub Actions Documentation: https://docs.github.com/en/actions
- Angular Build Documentation: https://angular.io/cli/build
- This project's README: `README.md`
- Setup Guide: `SETUP_GUIDE.md`

Good luck with your deployment! 🚀
