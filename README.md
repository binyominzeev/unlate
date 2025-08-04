# Unlate - Productivity & Habit Tracker

Never be late on your habits and goals. A modern, cross-platform productivity app built with Next.js, designed to help users build consistency and track their daily habits.

## ✨ Features

- **Progressive Web App (PWA)** - Installable on mobile and desktop
- **Cross-Platform** - Works on iOS, Android, and desktop via Capacitor
- **Habit Tracking** - Create, manage, and track daily habits
- **Progress Analytics** - Visualize streaks and completion rates
- **Daily Reflection** - Capture thoughts with daily feedback entries
- **User Authentication** - Secure login with email/password or magic links
- **Offline Support** - Works offline with data sync when online
- **Mobile-First Design** - Optimized for mobile with responsive desktop layout

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Prisma ORM with SQLite (easily switchable to PostgreSQL/Supabase)
- **Authentication**: NextAuth.js
- **PWA**: next-pwa for service worker and caching
- **Mobile**: Capacitor for native app packaging
- **State Management**: Zustand
- **Forms**: React Hook Form
- **Icons**: Lucide React

## 📱 Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd unlate
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment file and configure your variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Optional: Email provider settings
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@unlate.app"
```

### 4. Database Setup

Initialize and migrate the database:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Mobile App Development

### Building for Capacitor

1. Build the Next.js app:
```bash
npm run build
```

2. Initialize Capacitor (first time only):
```bash
npm run capacitor:init
```

3. Add platforms:
```bash
npm run capacitor:add:ios
npm run capacitor:add:android
```

4. Copy web assets and sync:
```bash
npm run capacitor:sync
```

5. Open in native IDEs:
```bash
npm run capacitor:open:ios
npm run capacitor:open:android
```

### Requirements for Mobile Development

- **iOS**: Xcode 14+, iOS 13+
- **Android**: Android Studio, API level 22+

## 🗄️ Database Schema

The app uses Prisma with the following main models:

- **User**: User accounts and authentication
- **Habit**: Habit definitions with settings
- **HabitEntry**: Daily habit completion records
- **DailyFeedback**: User reflection entries

### Switching to Supabase

To use Supabase instead of SQLite:

1. Create a Supabase project
2. Update `DATABASE_URL` in `.env.local`
3. Change the datasource in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
4. Run migrations: `npx prisma db push`

## 🎨 Customization

### Theming

The app uses CSS custom properties for theming. Modify colors in:
- `app/globals.css` - CSS custom properties
- `tailwind.config.ts` - Tailwind theme extension

### PWA Settings

Update PWA configuration in:
- `public/manifest.json` - App manifest
- `next.config.js` - Service worker settings

### Icons

Replace icon files in `public/icons/` with your own:
- Generate icons in sizes: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- Update `public/manifest.json` with new icon paths

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Self-Hosted

1. Build the app: `npm run build`
2. Start production server: `npm start`
3. Configure reverse proxy (nginx/Apache)

### Database in Production

For production, consider using:
- **Supabase** (recommended for easy setup)
- **PlanetScale** (MySQL-compatible)
- **Railway** or **Render** (PostgreSQL)

## 📊 Analytics & Monitoring

The app is prepared for adding analytics. Consider integrating:
- **Vercel Analytics** for web metrics
- **PostHog** for product analytics
- **Sentry** for error monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:push          # Push schema changes
npm run db:studio        # Open Prisma Studio
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run migrations

# Mobile (Capacitor)
npm run capacitor:sync   # Sync web assets to native
npm run capacitor:open:ios     # Open iOS project
npm run capacitor:open:android # Open Android project
```

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code comments

## 🗺️ Roadmap

- [ ] Social features (habit sharing)
- [ ] Team/family habit tracking
- [ ] Advanced analytics dashboard
- [ ] Habit templates and suggestions
- [ ] Integration with health apps
- [ ] Dark mode
- [ ] Multiple languages support

---

Built with ❤️ for consistency and productivity.
