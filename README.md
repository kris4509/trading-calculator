# Trading P&L Tracker

A modern web application for tracking daily trading profit and loss with multiple sessions per day, comprehensive analytics, charts, and performance statistics.

## Features

✅ **Daily Session Tracking** - Record multiple trading sessions per day with session name and P&L amount

✅ **Real-time Dashboard** - View today's P&L, monthly P&L, and monthly target progress at a glance

✅ **Multiple Sessions** - Track and manage as many trading sessions as needed per day

✅ **Performance Analytics** - Calculate win rate, average win/loss, profit factor, and more

✅ **Visual Charts** - Line charts for monthly trends and bar charts for daily performance

✅ **Monthly Target Management** - Set and track your monthly profit goals with visual progress bars

✅ **Data Persistence** - All data automatically saved to browser local storage

✅ **Data Export** - Export your trading data as JSON for backup and external analysis

✅ **Responsive Design** - Works seamlessly on desktop and mobile devices

✅ **Dark Mode Support** - Built with Tailwind CSS for modern UI

## Tech Stack

- **Frontend Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (via CDN)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Storage**: Browser Local Storage
- **State Management**: React Context API

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to project directory:
```bash
cd "trading calculator"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Header.jsx           # App header with branding
│   ├── DailyTracker.jsx     # Session input and tracking
│   ├── Charts.jsx           # Monthly trend and daily P&L charts
│   ├── Statistics.jsx       # Performance metrics and statistics
│   └── Settings.jsx         # Settings and data management
├── context/
│   └── TradingContext.jsx   # Global state management with Context API
├── App.jsx                  # Main application component
├── main.jsx                 # Entry point
└── App.css                  # Application styles
```

## Usage

### Adding a Trading Session

1. Go to the **Dashboard** or **Sessions** tab
2. Enter a session name (e.g., "Morning Session", "Afternoon Trade")
3. Enter the P&L amount (positive for profit, negative for loss)
4. Click "Add Session"

### Viewing Analytics

- **Dashboard**: Quick overview of today's P&L, monthly P&L, and target progress
- **Charts**: Visual representation of monthly trends and daily performance
- **Statistics**: Detailed trading metrics including:
  - Total trades
  - Win rate percentage
  - Average win/loss
  - Profit factor
  - Largest win/loss
  - Best/worst trades

### Setting Monthly Target

1. Go to **Settings**
2. Enter your desired monthly profit target
3. Click "Save"
4. The target progress bar on the dashboard will update automatically

### Managing Data

In the **Settings** tab:
- **Export Data**: Download your trading data as a JSON file for backup
- **Clear All Data**: Reset all trading data (use with caution!)

## Key Metrics Explained

- **Win Rate**: Percentage of profitable sessions out of total sessions
- **Average Win**: Mean profit of all winning sessions
- **Average Loss**: Mean loss of all losing sessions
- **Profit Factor**: Ratio of gross profit to gross loss (higher is better)
- **Largest Win/Loss**: Biggest single winning/losing session

## Data Storage

All data is stored locally in your browser's Local Storage. This means:
- ✅ Your data persists between sessions
- ✅ No account or login required
- ✅ Complete privacy - data never sent to any server
- ⚠️ Data is cleared if browser cache is cleared

## Tips for Best Usage

1. **Consistent Naming**: Use clear session names to easily identify trading sessions
2. **Regular Tracking**: Log sessions as they happen for accuracy
3. **Monthly Reviews**: Check the Statistics tab regularly to identify patterns
4. **Export Regularly**: Backup your data by exporting to JSON periodically
5. **Adjust Target**: Set realistic monthly targets to stay motivated

## Future Enhancement Ideas

Potential features for future versions:
- 📊 More advanced charts (Heatmaps, Risk/Reward ratios)
- 📱 Mobile app version
- ☁️ Cloud sync with backup
- 📈 Trend analysis and pattern recognition
- 🎯 Multiple currency support
- 🔔 Performance alerts and notifications
- 📋 Trade journal with notes
- 📅 Historical analysis by timeframe
- 🎓 Performance lessons and insights

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Important Notes

- The app uses Tailwind CSS via CDN for styling (fine for development, but for production deployment, install Tailwind CSS as a PostCSS plugin)
- All calculations are done on the client side for maximum performance
- Data is stored securely in browser local storage

## License

This project is open source and available for personal and commercial use.

---

**Built with ❤️ for traders who track their performance**

Last Updated: June 2, 2026
