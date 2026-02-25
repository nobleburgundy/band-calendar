# GitHub Pages Setup for band-calendar

## Quick Start

The project is ready to deploy to GitHub Pages. Follow these steps:

### 1. Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `band-calendar`
3. Owner: `nobleburgundy`
4. Make it Public
5. Click "Create repository"

### 2. Configure Local Git

Run these commands in your terminal:

```bash
cd /Users/jlmg/Documents/repos/aion

# Configure git (one time)
git config user.name "Your GitHub Username"
git config user.email "your.email@github.com"

# Add remote
git remote add origin https://github.com/nobleburgundy/band-calendar.git

# Rename branch to main
git branch -M main

# Initial commit and push
git add .
git commit -m "Initial commit: Angular 16 calendar event parser with pattern filtering and bands support"
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to https://github.com/nobleburgundy/band-calendar/settings
2. Scroll to "Pages" section
3. Source should be "Deploy from a branch"
4. Branch: Select `gh-pages` (it will be auto-created after first action run)
5. Click Save

### 4. First Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:

- Build the project when you push to main
- Deploy the `dist` folder to the `gh-pages` branch
- Make it available at: **https://nobleburgundy.github.io/band-calendar/**

The first deployment takes a few minutes. You can monitor progress in the "Actions" tab.

### 5. Future Updates

Just push your changes:

```bash
git add .
git commit -m "Your message"
git push
```

The site will automatically rebuild and deploy!

## Configuration Details

### Build Configuration

- **Angular CLI**: 16.2.16
- **Output Path**: `./dist`
- **Base Href**: `/band-calendar/` (already set in `angular.json`)
- **Production Build**: Optimized with hashing

### GitHub Actions Workflow

The workflow automatically:

1. Checks out the code
2. Installs Node 18
3. Runs `npm ci` (clean install)
4. Runs `npm run build` (production build)
5. Deploys the `dist` folder to `gh-pages` branch

### Accessing the Site

Once deployed, the site is available at:

- **URL**: https://nobleburgundy.github.io/band-calendar/
- **Direct Link**: https://nobleburgundy.github.io/band-calendar/

All routing and assets are configured to work with this base path.

## Troubleshooting

### Site not appearing after push

1. Check the "Actions" tab in your GitHub repository
2. Verify the deployment workflow succeeded (green checkmark)
3. Go to Settings → Pages and verify `gh-pages` is selected
4. Wait 2-3 minutes and refresh your browser

### Build fails in GitHub Actions

1. Check the workflow logs in the "Actions" tab
2. Common issues:
   - Node version incompatibility (should be 18+)
   - Missing npm dependencies (try `npm ci` locally)
   - Build errors (check `npm run build` locally first)

### 404 errors when accessing the site

This usually means the base href is wrong. The project is configured for `/band-calendar/`, so:

- ✅ Correct: https://nobleburgundy.github.io/band-calendar/
- ❌ Wrong: https://nobleburgundy.github.io/aion/

## Environment Variables

No environment variables are needed for basic deployment. If you add API keys or secrets later:

1. Add them in Settings → Secrets and variables → Actions
2. Reference them in the workflow as `${{ secrets.YOUR_SECRET }}`

## Notes

- The `dist` folder is gitignored and only generated during build
- GitHub Actions will build from source on every push
- DNS/CNAME configuration is not needed - just use the default GitHub Pages URL
- The site uses client-side routing (no server required)
