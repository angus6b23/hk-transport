import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'HK Bus',
  webDir: 'dist',
  bundledWebRuntime: false
  CAPACITOR_ANDROID_STUDIO_PATH: '/usr/bin/flatpak run --branch=stable --arch=x86_64 --command=android-studio com.google.AndroidStudio'
};

export default config;
