# Calendar Event Parser - Setup & Deployment Guide

## Project Overview

You now have a fully functional **Calendar Event Parser** application built with:

- **Angular 16** - Modern framework with standalone components
- **Bootstrap 5** - Responsive CSS framework
- **RxJS** - Reactive programming with Observables
- **TypeScript** - Type-safe development
- **GitHub Actions** - Automated deployment to GitHub Pages

## What's Been Built

### Core Features

1. **Multiple Calendar Management**
   - Add/remove calendars dynamically
   - Show/hide calendars with checkboxes
   - Event count per calendar

2. **Pattern-Based Event Filtering**
   - Search events by custom text patterns
   - Example: "(C) White Squirrel" finds all events with that text in the title
   - Add/remove patterns dynamically
   - Real-time filtering

3. **Mock Calendar Data**
   - Pre-loaded with 8 sample events across 3 calendars
   - Includes events with and without patterns
   - Perfect for UI testing before API integration

4. **Responsive UI**
   - Sidebar for calendar and pattern management
   - Main content area for event list
   - Card-based design with Bootstrap styling
   - Mobile-friendly layout

## Project Structure

```
/Users/jlmg/Documents/repos/aion/
├── src/
│   ├── app/
│   │   ├── app.component.ts                     # Root component
│   │   ├── components/
│   │   │   ├── event-parser.component.ts        # Main layout & logic
│   │   │   ├── calendar-list/
│   │   │   │   └── calendar-list.component.ts  # Calendar management UI
│   │   │   ├── event-item/
│   │   │   │   └── event-item.component.ts     # Event display card
│   │   │   └── search-patterns/
│   │   │       └── search-patterns.component.ts # Pattern management UI
│   │   ├── models/
│   │   │   └── event.model.ts                  # TypeScript interfaces
│   │   └── services/
│   │       └── event.service.ts                # Business logic & data
│   ├── assets/
│   │   └── mock-events.json                    # Mock data (unused, data in service)
│   ├── styles.css                              # Global styles + Bootstrap import
│   └── index.html                              # Main HTML
├── .github/
│   └── workflows/
│       └── deploy.yml                          # GitHub Actions workflow
├── package.json                                # Dependencies & scripts
├── angular.json                                # Angular CLI config
├── tsconfig.json                               # TypeScript config
└── README.md                                   # Documentation
```

## Running Locally

The development server is currently running at `http://localhost:4200`

To run it again in the future:

```bash
cd /Users/jlmg/Documents/repos/aion
npm start
```

Then visit `http://localhost:4200` in your browser.

## Available npm Scripts

```bash
npm start              # Start dev server (http://localhost:4200)
npm run build          # Build for production
npm run build:github   # Build for GitHub Pages (with correct base href)
npm run watch          # Build in watch mode during development
```

## Deploying to GitHub Pages

### Step 1: Create GitHub Repository

```bash
cd /Users/jlmg/Documents/repos/aion
git init
git add .
git commit -m "Initial commit: Calendar Event Parser"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aion.git
git push -u origin main
```

### Step 2: Configure GitHub Pages

1. Go to `https://github.com/YOUR_USERNAME/aion/settings`
2. Navigate to **Pages** (left sidebar)
3. Set **Source** to "Deploy from a branch"
4. Select `gh-pages` branch (it will be created automatically)
5. Click **Save**

### Step 3: Automatic Deployment

The `.github/workflows/deploy.yml` workflow will:

- Trigger on every push to `main` branch
- Build the app with `/aion/` base href
- Deploy to the `gh-pages` branch automatically

Your app will be available at: `https://YOUR_USERNAME.github.io/aion/`

**That's it!** No manual deployment needed after the first setup.

## Key Components Explained

### EventService (`src/app/services/event.service.ts`)

Central service managing:

- Mock event data (currently hardcoded)
- Calendar visibility state
- Search patterns
- Event filtering logic

**Key Methods:**

- `toggleCalendarVisibility(calendarId)` - Show/hide a calendar
- `updateSearchPatterns(patterns)` - Update search filters
- `addCalendar(id, name)` - Add new calendar
- `removeCalendar(calendarId)` - Remove calendar

### EventParserComponent (`src/app/components/event-parser.component.ts`)

Main layout component featuring:

- Layout with Bootstrap grid
- Sidebar (calendars + patterns)
- Main content area (event list)
- Responsive design

### CalendarListComponent

Manages calendar visibility:

- Checkboxes for show/hide
- Add/remove buttons
- Event count badges

### SearchPatternsComponent

Manages search patterns:

- Display active patterns
- Add new patterns
- Remove patterns
- Real-time filtering

### EventItemComponent

Displays individual events:

- Event title and description
- Calendar name
- Start/end times
- Venue information
- Confirmation status (badge)
- Matched patterns

## Updating Mock Data

Currently, mock data is hardcoded in `EventService`. To update:

1. Open `src/app/services/event.service.ts`
2. Find the `loadMockData()` method
3. Modify the `mockEvents` array with new event data

Example event structure:

```typescript
{
  id: '1',
  calendarId: 'personal',
  calendarName: 'Personal Calendar',
  title: 'Team Meeting (C) White Squirrel',
  description: 'Weekly team sync',
  startTime: '2026-02-24T10:00:00Z',
  endTime: '2026-02-24T11:00:00Z',
  confirmed: true,
  venue: 'White Squirrel'
}
```

## Preparing for Gmail Calendar API

When you're ready to integrate Gmail Calendar:

1. **Set up Google Cloud Project**
   - Create project at https://console.cloud.google.com
   - Enable Google Calendar API
   - Create OAuth2 credentials (Authorized JavaScript origins)

2. **Update EventService**
   - Remove hardcoded mock data
   - Add Google Calendar API client
   - Implement OAuth2 login flow

3. **Update Environment Config**
   - Add Google API credentials to environment files
   - Example: `src/environments/environment.ts`

4. **Example Integration Pattern**

   ```typescript
   // Fetch calendars from Google
   getCalendarsFromGoogle(): Observable<Calendar[]> {
     return this.googleCalendarAPI.listCalendars();
   }

   // Fetch events from Google
   getEventsFromGoogle(calendarId: string): Observable<CalendarEvent[]> {
     return this.googleCalendarAPI.listEvents(calendarId);
   }
   ```

## Customization Options

### Styling

- Edit `src/styles.css` for global styles
- Bootstrap CSS is imported at the top
- Component-specific styles use `styles` property

### Search Patterns

- Default pattern is "(C)" (for confirmed events)
- Users can add any text pattern
- Patterns are case-sensitive

### Calendar Management

- Users can add up to unlimited calendars
- Calendars are stored in memory (not persisted)
- To persist: integrate with localStorage or backend

## Testing the App

### Test Calendars

- Personal Calendar (3 events)
- Work Calendar (3 events)
- Fitness Calendar (2 events)

### Test Patterns

- Try searching for "(C)" to see confirmed events
- Try searching for location names like "White Squirrel"
- Add custom patterns like "Meeting" or "Yoga"

### Test Features

1. ✅ Toggle calendar visibility
2. ✅ Add/remove calendars
3. ✅ Add/remove search patterns
4. ✅ Filter events in real-time
5. ✅ View event details (time, venue, status)

## Troubleshooting

### Port 4200 Already in Use

```bash
# Kill the process using port 4200
lsof -ti:4200 | xargs kill -9

# Or use a different port
ng serve --port 4201
```

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### GitHub Pages Not Updating

1. Check Actions tab in GitHub for deployment status
2. Verify `gh-pages` branch exists
3. Check Pages settings - source should be `gh-pages` branch
4. Wait 2-3 minutes for GitHub to update

## Next Steps

1. **Test the app locally** - Verify all features work as expected
2. **Customize mock data** - Add your own test events
3. **Create GitHub repo** - Follow deployment steps above
4. **Plan Gmail integration** - Set up Google Cloud Project
5. **Add persistence** - Consider localStorage or backend database

## Support Files

- `README.md` - User-facing documentation
- `.github/workflows/deploy.yml` - Automated GitHub Pages deployment
- `angular.json` - Angular CLI configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts

## Notes

- All data is currently in-memory (not persisted)
- Search is case-sensitive (e.g., "(C)" vs "(c)")
- Timestamps use ISO 8601 format
- Bootstrap Icons loaded from CDN
- No backend required (yet)

Enjoy your Calendar Event Parser! 🎉
