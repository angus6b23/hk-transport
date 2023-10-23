import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.hkTransport',
  appName: 'HK Transport',
  webDir: 'dist',
  bundledWebRuntime: false,
  CAPACITOR_ANDROID_STUDIO_PATH: '/usr/bin/flatpak run --branch=stable --arch=x86_64 --command=android-studio com.google.AndroidStudio'
};

export default config;
