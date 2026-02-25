# Deployment Instructions for GitHub Pages

## Setup GitHub Repository

1. Create a new repository on GitHub named `band-calendar` in your `nobleburgundy` account
   - URL: https://github.com/nobleburgundy/band-calendar

2. Configure the local repository:
```bash
git config user.name "Your Name"
git config user.email "your.email@github.com"
git remote add origin https://github.com/nobleburgundy/band-calendar.git
git branch -M main
```

3. Create a `.gitignore` file (if not already present):
```bash
# Already included in the repo
```

4. Create GitHub Pages deploy workflow

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## Deploy Steps

1. First push:
```bash
git add .
git commit -m "Initial commit: Angular 16 calendar event parser"
git push -u origin main
```

2. Subsequent deploys:
```bash
git add .
git commit -m "Your commit message"
git push
```

## Verify Deployment

1. Go to https://github.com/nobleburgundy/band-calendar
2. Settings → Pages
3. Verify it's set to deploy from branch "gh-pages"
4. Access the site at: https://nobleburgundy.github.io/band-calendar/

