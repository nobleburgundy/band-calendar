# Calendar Event Parser

A web application that parses calendar events and filters them by custom text patterns. Built with Angular, Bootstrap, and designed for GitHub Pages deployment.

## Features

- 📅 **Multiple Calendar Support**: Add and manage multiple calendars
- 🔍 **Pattern-Based Filtering**: Search events by custom text patterns (e.g., "(C) White Squirrel" for confirmed locations)
- ✅ **Calendar Visibility Toggle**: Show/hide calendars with checkboxes
- 📱 **Responsive Design**: Bootstrap-based responsive UI
- 🧪 **Mock Data**: Pre-loaded mock data for testing the UI
- 🚀 **GitHub Pages Ready**: Pre-configured for easy deployment

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── event-parser.component.ts       # Main component
│   │   ├── calendar-list/                  # Calendar management
│   │   ├── event-item/                     # Event display
│   │   └── search-patterns/                # Pattern management
│   ├── services/
│   │   └── event.service.ts               # Event and calendar logic
│   ├── models/
│   │   └── event.model.ts                 # TypeScript interfaces
│   └── app.component.ts                   # Root component
├── assets/
│   └── mock-events.json                   # Mock calendar data
├── index.html
└── styles.css
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Open your browser and navigate to `http://localhost:4200`

## Development

### Running the app locally

```bash
npm start
```

### Build

```bash
npm run build
```

## Features Overview

### Adding Calendars

1. In the **Calendars** panel, click **"Add Calendar"**
2. Enter Calendar ID and Name
3. Click **"Add"**

### Managing Search Patterns

1. In the **Search Patterns** panel, click **"Add Pattern"**
2. Enter a pattern to match (e.g., "(C) White Squirrel")
3. Events auto-filter to show matches

### Filtering Events

- Use checkboxes to show/hide specific calendars
- Combine with search patterns for fine-grained filtering
- Events update in real-time

## GitHub Pages Deployment

### Setup

1. Push to GitHub
2. Go to **Settings** > **Pages**
3. Select **gh-pages** branch as source

### Automatic Deployment

GitHub Actions automatically:

1. Builds the app with correct base href (`/aion/`)
2. Deploys to `gh-pages` branch
3. App available at `https://YOUR_USERNAME.github.io/aion/`

Just push to `main` branch and deployment happens automatically.

## Data Structure

### CalendarEvent

```typescript
{
  id: string;
  calendarId: string;
  calendarName: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  confirmed: boolean;
  venue: string | null;
}
```

## Connecting to Gmail Calendar API

Future integration steps:

1. Set up Google Calendar API credentials
2. Update `EventService` to fetch from Gmail API
3. Implement OAuth2 authentication
4. Add calendar selection from user's calendars

## Styling

- Bootstrap 5 for responsive design
- Custom card-based UI components
- Primary color: `#0d6efd`

## Notes

- Mock data pre-loaded in `EventService`
- Data stored in memory (not persisted)
- Ready for Gmail Calendar API integration
