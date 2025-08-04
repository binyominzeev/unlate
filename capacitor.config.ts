import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.unlate.app',
  appName: 'Unlate',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1f2937',
      showSpinner: true,
      spinnerColor: '#ffffff'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1f2937'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark'
    },
    Haptics: {},
    App: {
      deepLinkingEnabled: true
    }
  }
};

export default config;
