# Native App Packaging Guide

This guide covers packaging Unlate as native mobile and desktop applications using Capacitor, Electron, and other frameworks.

## Overview

Unlate can be packaged as a native app in several ways:

1. **Progressive Web App (PWA)** - Installable web app (recommended)
2. **Capacitor** - Native iOS/Android apps
3. **Electron** - Desktop apps (Windows, macOS, Linux)
4. **Tauri** - Lightweight desktop apps
5. **Expo** - Alternative for React Native

## Progressive Web App (PWA)

The easiest and most recommended approach. PWAs work across all platforms and provide native-like experiences.

### Features Available

- **Installable** on all major platforms
- **Offline functionality** with service workers
- **Push notifications** (with additional setup)
- **Native-like UI** with mobile-first design
- **App-like navigation** without browser UI

### Installation Instructions

#### Mobile (iOS/Android)
1. Open Unlate in mobile browser
2. Look for "Add to Home Screen" option
3. Follow platform-specific prompts
4. App appears on home screen

#### Desktop (Chrome/Edge)
1. Navigate to Unlate
2. Look for install icon in address bar
3. Click to install as desktop app
4. App appears in applications menu

### PWA Development

The PWA is already configured with:
- `manifest.json` with proper metadata
- Service worker for offline functionality
- Mobile-optimized responsive design
- App-like navigation patterns

## Capacitor (Native Mobile Apps)

Package as native iOS and Android applications.

### Prerequisites

- **Xcode** (for iOS development)
- **Android Studio** (for Android development)
- **iOS Developer Account** (for App Store)
- **Google Play Developer Account** (for Play Store)

### Setup

1. **Install Capacitor**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   ```

2. **Configure Capacitor**
   
   Edit `capacitor.config.ts`:
   ```typescript
   import { CapacitorConfig } from '@capacitor/core';

   const config: CapacitorConfig = {
     appId: 'com.unlate.app',
     appName: 'Unlate',
     webDir: '.next',
     server: {
       androidScheme: 'https'
     },
     plugins: {
       PushNotifications: {
         presentationOptions: ["badge", "sound", "alert"]
       }
     }
   };

   export default config;
   ```

3. **Add Platforms**
   ```bash
   npm install @capacitor/android @capacitor/ios
   npx cap add ios
   npx cap add android
   ```

4. **Build and Sync**
   ```bash
   npm run build
   npx cap sync
   ```

### iOS Development

1. **Open in Xcode**
   ```bash
   npx cap open ios
   ```

2. **Configure App**
   - Set bundle identifier
   - Configure signing certificates
   - Set app icons and splash screens
   - Configure permissions in `Info.plist`

3. **Required Permissions** (add to `Info.plist`):
   ```xml
   <key>NSCameraUsageDescription</key>
   <string>App needs camera access for profile photos</string>
   <key>NSMicrophoneUsageDescription</key>
   <string>App needs microphone for voice notes</string>
   ```

4. **Build for Device**
   - Select target device or simulator
   - Build and run from Xcode

### Android Development

1. **Open in Android Studio**
   ```bash
   npx cap open android
   ```

2. **Configure App**
   - Set application ID in `build.gradle`
   - Configure signing certificates
   - Set app icons and splash screens
   - Configure permissions in `AndroidManifest.xml`

3. **Required Permissions** (add to `AndroidManifest.xml`):
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
   ```

4. **Build APK**
   - Build → Generate Signed Bundle/APK
   - Select APK and follow signing steps

### Capacitor Plugins

Add native functionality:

```bash
# Push notifications
npm install @capacitor/push-notifications

# Local notifications (for habit reminders)
npm install @capacitor/local-notifications

# Camera (for profile photos)
npm install @capacitor/camera

# File system
npm install @capacitor/filesystem

# Status bar styling
npm install @capacitor/status-bar
```

### App Store Deployment

#### iOS App Store

1. **Prepare for Release**
   - Archive build in Xcode
   - Upload to App Store Connect
   - Fill out app metadata
   - Submit for review

2. **App Store Assets**
   - App icons (various sizes)
   - Screenshots (multiple devices)
   - App description and keywords
   - Privacy policy URL

#### Google Play Store

1. **Prepare Release**
   - Generate signed APK/AAB
   - Upload to Google Play Console
   - Fill out store listing
   - Submit for review

2. **Play Store Assets**
   - High-res icon (512x512)
   - Feature graphic (1024x500)
   - Screenshots (multiple sizes)
   - Short and full descriptions

## Electron (Desktop Apps)

Package as desktop applications for Windows, macOS, and Linux.

### Setup

1. **Install Electron**
   ```bash
   npm install --save-dev electron electron-builder
   ```

2. **Create Electron Main Process**
   
   Create `electron/main.js`:
   ```javascript
   const { app, BrowserWindow } = require('electron')
   const path = require('path')
   const isDev = process.env.NODE_ENV === 'development'

   function createWindow() {
     const mainWindow = new BrowserWindow({
       width: 1200,
       height: 800,
       webPreferences: {
         nodeIntegration: false,
         contextIsolation: true,
         enableRemoteModule: false
       },
       icon: path.join(__dirname, '../public/icon-256x256.png')
     })

     const startUrl = isDev 
       ? 'http://localhost:3000' 
       : `file://${path.join(__dirname, '../.next/index.html')}`
     
     mainWindow.loadURL(startUrl)
   }

   app.whenReady().then(createWindow)

   app.on('window-all-closed', () => {
     if (process.platform !== 'darwin') {
       app.quit()
     }
   })

   app.on('activate', () => {
     if (BrowserWindow.getAllWindows().length === 0) {
       createWindow()
     }
   })
   ```

3. **Update package.json**
   ```json
   {
     "main": "electron/main.js",
     "scripts": {
       "electron": "electron .",
       "electron-dev": "NODE_ENV=development electron .",
       "build-electron": "npm run build && electron-builder"
     },
     "build": {
       "appId": "com.unlate.app",
       "productName": "Unlate",
       "directories": {
         "output": "dist-electron"
       },
       "files": [
         ".next/**/*",
         "electron/**/*",
         "public/**/*"
       ],
       "mac": {
         "category": "public.app-category.productivity"
       },
       "win": {
         "target": "nsis"
       },
       "linux": {
         "target": "AppImage"
       }
     }
   }
   ```

4. **Build Desktop Apps**
   ```bash
   npm run build-electron
   ```

## Tauri (Rust-based Desktop Apps)

Lightweight alternative to Electron using Rust.

### Setup

1. **Install Tauri CLI**
   ```bash
   npm install --save-dev @tauri-apps/cli
   ```

2. **Initialize Tauri**
   ```bash
   npx tauri init
   ```

3. **Configure tauri.conf.json**
   ```json
   {
     "build": {
       "beforeBuildCommand": "npm run build",
       "beforeDevCommand": "npm run dev",
       "devPath": "http://localhost:3000",
       "distDir": ".next"
     },
     "package": {
       "productName": "Unlate",
       "version": "1.0.0"
     },
     "tauri": {
       "allowlist": {
         "all": false,
         "fs": {
           "all": false,
           "readFile": true,
           "writeFile": true
         }
       }
     }
   }
   ```

4. **Build**
   ```bash
   npx tauri build
   ```

## Testing Native Apps

### General Testing

1. **Functionality Testing**
   - All web features work in native wrapper
   - Authentication flows properly
   - Data persistence works
   - Offline functionality (PWA/Capacitor)

2. **Performance Testing**
   - App startup time
   - Navigation responsiveness
   - Memory usage
   - Battery impact (mobile)

3. **Platform-Specific Testing**
   - Native navigation patterns
   - Platform-specific UI elements
   - Hardware integration (camera, notifications)

### Testing Checklist

- [ ] App installs successfully
- [ ] Authentication works
- [ ] Habit tracking functionality
- [ ] Daily feedback submission
- [ ] Offline mode (where applicable)
- [ ] Push notifications (if implemented)
- [ ] App store compliance
- [ ] Performance benchmarks

## Distribution

### Code Signing

#### macOS
```bash
# Sign the app
codesign --force --deep --sign "Developer ID Application: Your Name" Unlate.app

# Create installer
productbuild --component Unlate.app /Applications Unlate-Installer.pkg --sign "Developer ID Installer: Your Name"
```

#### Windows
- Use Windows SDK signing tools
- Obtain code signing certificate
- Sign executable before distribution

### App Store Guidelines

#### iOS App Store
- Follow Human Interface Guidelines
- Implement App Store Review Guidelines
- Provide privacy policy
- Handle in-app purchases (if any)

#### Google Play Store
- Follow Material Design guidelines
- Implement Play Console policies
- Handle billing (if any)
- Provide content rating

#### Microsoft Store
- Follow Fluent Design System
- Implement Store policies
- Handle Microsoft billing (if any)

## Maintenance

### Updates

#### PWA
- Automatic updates through service worker
- Users get latest version on next visit

#### Native Apps
- **iOS**: Submit updates through App Store Connect
- **Android**: Upload to Google Play Console
- **Desktop**: Implement auto-updater or manual downloads

### Monitoring

- App store reviews and ratings
- Crash reporting (Sentry, Bugsnag)
- Usage analytics
- Performance monitoring

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Electron Documentation](https://www.electronjs.org/docs)
- [Tauri Documentation](https://tauri.app/v1/guides/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Android Design Guidelines](https://developer.android.com/design)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)