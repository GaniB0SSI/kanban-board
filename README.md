# Kanban Board

A modern, responsive Kanban board application built with SvelteKit, featuring drag-and-drop functionality, PWA capabilities, and comprehensive task management.

## Features

### Core Functionality (46P)
- ✅ **4 Lanes**: Do, Doing, Done, Archiv with proper German labels
- ✅ **Drag & Drop**: Native HTML5 drag-and-drop without external libraries
- ✅ **Issue Creation**: HTML `<dialog>` element for task creation
- ✅ **Required Fields**: Title, Description, Creation Date, Due Date, Story Points, Priority
- ✅ **localStorage**: Persistent storage of all tasks and their positions
- ✅ **ICS Export**: Individual task export with proper UID, DTSTAMP, PRODID
- ✅ **Web Share API**: Native sharing with clipboard fallback
- ✅ **CSV Export**: Complete task data export
- ✅ **User Location**: Automatic country detection via Geo API
- ✅ **Overdue Indicator**: Visual warning for past-due tasks
- ✅ **Notifications**: Browser notifications when tasks move to Done
- ✅ **Story Points**: Lane totals with proper calculation

### Component Architecture (16P)
- ✅ **Modular Components**: Board, IssueCard, TaskModal, UserLocation
- ✅ **Clean Structure**: Organized in `src/lib/components/`
- ✅ **Separation of Concerns**: Logic properly distributed

### UX & Design (10P)
- ✅ **Modern UI**: Clean, responsive design with Tailwind CSS
- ✅ **Accessibility**: ARIA roles, keyboard navigation support
- ✅ **Visual Feedback**: Hover effects, overdue badges, validation messages

### PWA & Performance (10P)
- ✅ **Installable**: Web App Manifest with proper icons
- ✅ **Offline Support**: Service Worker with caching strategy
- ✅ **Performance**: Optimized loading and caching

### Git & Documentation (18P)
- ✅ **Regular Commits**: Thematic commits with clear messages
- ✅ **Project Documentation**: Comprehensive README
- ✅ **AI Transparency**: This project was developed with AI assistance

## Technology Stack

- **Frontend**: SvelteKit 2.x
- **Styling**: Tailwind CSS 4.x
- **Date Handling**: date-fns
- **PWA**: Service Worker, Web App Manifest
- **Storage**: localStorage for persistence
- **APIs**: Web Share API, Notification API, Geo API

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd KanbanBoard
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
npm run preview
```

## Usage

### Creating Tasks
1. Click "Add Task" button
2. Fill in all required fields:
   - Title (required)
   - Description (required) 
   - Due Date (required)
   - Story Points (required, positive integer)
   - Priority (required)
3. Click "Add" to create the task

### Managing Tasks
- **Drag & Drop**: Move tasks between lanes by dragging
- **Edit**: Click "Edit" on any task to modify details
- **Delete**: Click "Delete" to remove tasks
- **Export**: Use "ICS" for calendar export, "Share" for native sharing
- **CSV**: Download all tasks as CSV via "Download CSV" button

### PWA Installation
1. Open the app in a modern browser
2. Look for the install prompt or use browser menu
3. Install as a native app for offline access

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── Board.svelte          # Main board container
│   │   ├── IssueCard.svelte     # Individual task cards
│   │   ├── TaskModal.svelte     # Task creation/editing dialog
│   │   └── UserLocation.svelte  # Country display component
│   └── assets/
├── routes/
│   ├── +layout.svelte           # App layout with PWA setup
│   └── +page.svelte            # Main page logic
static/
├── manifest.json               # PWA manifest
├── service-worker.js          # Service worker for offline support
└── icons/                     # PWA icons
```

## Features in Detail

### Drag & Drop
- Native HTML5 drag-and-drop implementation
- Visual feedback during drag operations
- Proper ARIA roles for accessibility

### Data Persistence
- All tasks stored in localStorage
- Automatic save on any changes
- Data survives browser restarts

### Export Capabilities
- **ICS**: Individual task calendar events with proper formatting
- **CSV**: Complete task data for spreadsheet import
- **Web Share**: Native sharing with fallback to clipboard

### PWA Features
- Installable on mobile and desktop
- Offline functionality with service worker
- App-like experience with standalone display

## Development Notes

This project was developed with AI assistance to meet academic requirements. The codebase maintains readability and follows SvelteKit best practices. All requirements from the assignment specification have been implemented.

### Commit Strategy
- Regular commits (3-5 per hour)
- Thematic commits with clear messages
- Maximum 5 files changed per commit

## License

This project is developed for academic purposes.

## PWA / Offline Verification (Quick Test)

Follow these steps to verify the PWA and offline behavior:

1. Build and serve the production build (recommended):

```powershell
npm run build; npm run preview
```

2. Open the site in Chromium-based browser (Chrome, Edge) at the preview URL.

3. Open DevTools > Application > Manifest to confirm the manifest loads and icons are detected.

4. In DevTools > Application > Service Workers, confirm the service worker is registered and running. You should see `/service-worker.js` and that it controls the page.

5. Test installability: A small install prompt should appear (or use the browser menu to "Install app"). We also added an in-app "Install App" button when the browser fires the `beforeinstallprompt` event.

6. Test offline:
   - With DevTools offline throttling or by turning off network, reload the page. The app should still load (served from cache) and you should see the offline fallback if the main page isn't available.
   - Create or modify tasks while offline. The app uses `localStorage` so changes persist locally and will remain after reload.

7. Test updates: When deploying a new version, the app exposes an "Update Available — Refresh" button to activate the new service worker and refresh the page.

If something fails, check the browser console and the Service Worker panel for errors. Common issues are wrong paths in `manifest.json` or missing icon files.