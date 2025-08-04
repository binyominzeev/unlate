# Unlate - Never Be Late Again

A cross-platform productivity app built with Next.js, designed to help you beat procrastination through daily habit tracking and feedback. Built as a Progressive Web App (PWA) for mobile-first experience and native app capabilities.

## Features

- **Daily Habit Tracking**: Create and track custom habits with visual progress indicators
- **Daily Feedback**: Reflect on your day with mood tracking and written feedback
- **User Authentication**: Simple username/email based authentication
- **Progressive Web App**: Installable on mobile devices with offline capabilities
- **Mobile-First Design**: Optimized for mobile devices and responsive across all screen sizes
- **Real-time Updates**: Instant progress tracking and feedback saving

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Authentication**: NextAuth.js with credentials provider
- **Database**: Prisma ORM with SQLite
- **PWA**: next-pwa for service worker and manifest configuration
- **Styling**: Tailwind CSS for mobile-first responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/binyominzeev/unlate.git
cd unlate
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env .env.local
# Edit .env.local with your configuration
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

The app uses SQLite for simplicity. The database file will be created automatically when you run the migration.

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Optional: View database in Prisma Studio
npx prisma studio
```

## Usage

### Creating an Account

1. Navigate to the app
2. Click "Get Started" or "Sign Up"
3. Fill in your details (email or username required)
4. Create your account

### Habit Tracking

1. Sign in to your account
2. Access the dashboard
3. View existing habits or create new ones
4. Click the circle next to each habit to mark as complete
5. Track your daily progress and completion rates

### Daily Feedback

1. Use the "Daily Reflection" section on the dashboard
2. Rate your mood (1-5 scale)
3. Write feedback about your day
4. Save your reflection

## PWA Installation

### Mobile Devices

1. Open the app in your mobile browser
2. Look for "Add to Home Screen" option in browser menu
3. Follow the prompts to install
4. Access the app from your home screen

### Desktop

1. Visit the app in Chrome/Edge
2. Look for the install icon in the address bar
3. Click to install as a desktop app

## Development

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main app dashboard
│   └── globals.css        # Global styles
├── components/            # Reusable React components
├── lib/                   # Utility functions and configs
└── types/                 # TypeScript type definitions

prisma/
└── schema.prisma          # Database schema

public/
├── manifest.json          # PWA manifest
└── *.png                  # PWA icons
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Commands

```bash
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema changes to database
npx prisma studio       # Open database browser
npx prisma migrate dev  # Create new migration
```

## Production Deployment

### Environment Variables

Set the following environment variables in production:

```env
DATABASE_URL="file:./prod.db"
NEXTAUTH_SECRET="your-secure-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

### Build and Deploy

```bash
npm run build
npm run start
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/binyominzeev/unlate)

## Native App Packaging

### With Capacitor

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
npx cap init

# Add platforms
npx cap add ios
npx cap add android

# Build and sync
npm run build
npx cap sync

# Open in native IDEs
npx cap open ios
npx cap open android
```

### With Expo (Alternative)

```bash
# Install Expo CLI
npm install -g @expo/cli

# Create Expo project
npx create-expo-app --template blank-typescript

# Configure for web
npx expo install react-native-web
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the development team.
