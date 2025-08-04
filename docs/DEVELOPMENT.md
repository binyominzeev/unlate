# Development Setup Guide

This guide will help you set up the Unlate development environment on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** (LTS recommended)
- **npm** or **yarn** package manager
- **Git** for version control

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/binyominzeev/unlate.git
cd unlate
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment file and configure it:

```bash
cp .env .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Important**: Generate a secure secret for `NEXTAUTH_SECRET` in production:
```bash
openssl rand -base64 32
```

### 4. Database Setup

Initialize the database with Prisma:

```bash
# Generate Prisma client
npx prisma generate

# Create the database and tables
npx prisma db push

# (Optional) Seed the database with sample data
npx prisma db seed
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the application for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |
| `npx prisma studio` | Open database browser |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma db push` | Push schema changes to database |

## PWA Development

### Testing PWA Features

1. **Build the app**: `npm run build`
2. **Start production server**: `npm run start`
3. **Open DevTools** → Application tab → Service Workers
4. **Test offline**: Network tab → Toggle offline mode

### PWA Installation Testing

#### Desktop (Chrome/Edge)
1. Navigate to the app
2. Look for install icon in address bar
3. Click to install as desktop app

#### Mobile (iOS Safari)
1. Open app in Safari
2. Tap Share button
3. Select "Add to Home Screen"

#### Mobile (Android Chrome)
1. Open app in Chrome
2. Tap menu (three dots)
3. Select "Add to Home screen"

## Project Structure

```
unlate/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── habits/        # Habit management
│   │   │   └── feedback/      # Daily feedback
│   │   ├── auth/              # Auth pages
│   │   ├── dashboard/         # Main app interface
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   ├── lib/                   # Utilities and configs
│   └── types/                 # TypeScript definitions
├── prisma/
│   └── schema.prisma          # Database schema
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   └── *.png                  # PWA icons
└── README.md
```

## Common Development Tasks

### Adding New Habits API

1. Create API route in `src/app/api/habits/`
2. Update Prisma schema if needed
3. Run `npx prisma db push` to update database
4. Add TypeScript types in `src/types/`

### Modifying Database Schema

1. Edit `prisma/schema.prisma`
2. Generate migration: `npx prisma migrate dev --name description`
3. Update API routes and TypeScript types as needed

### Adding New Pages

1. Create page in `src/app/` directory
2. Add navigation links as needed
3. Update authentication guards if required

## Troubleshooting

### Common Issues

**"Prisma Client not found"**
```bash
npx prisma generate
```

**Database connection issues**
- Check `DATABASE_URL` in `.env.local`
- Ensure SQLite file permissions are correct

**NextAuth errors**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your development URL

**PWA not installing**
- Ensure app is served over HTTPS (or localhost)
- Check manifest.json is accessible
- Verify service worker registration

### Development Tips

1. **Use Prisma Studio** for database inspection: `npx prisma studio`
2. **Check browser DevTools** for PWA compliance
3. **Test mobile responsiveness** with DevTools device emulation
4. **Monitor console** for authentication and API errors

## Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test thoroughly
3. Run linting: `npm run lint`
4. Build and test: `npm run build`
5. Commit and push changes
6. Create pull request

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)