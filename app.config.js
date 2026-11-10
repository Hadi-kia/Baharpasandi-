// EXPO_PROJECT_ID must be the real EAS project ID before publishing OTA updates.
const projectId = process.env.EXPO_PROJECT_ID;
const config = {
  name: 'میراث ایرانیان', slug: 'miras-iranian', scheme: 'mirasiranian',
  version: '1.0.0', orientation: 'portrait', userInterfaceStyle: 'light',
  android: { package: 'com.mirasiranian.app', versionCode: 1, edgeToEdgeEnabled: true, permissions: [] },
  ios: { bundleIdentifier: 'com.mirasiranian.app', supportsTablet: true },
  runtimeVersion: { policy: 'appVersion' },
  plugins: ['expo-updates'],
  extra: { releaseManifestUrl: 'https://mirasiranian.com/app/android/latest.json', eas: projectId ? { projectId } : {} }
};
if (projectId) config.updates = {
  url: `https://u.expo.dev/${projectId}`, enabled: true,
  checkAutomatically: 'ON_LOAD', fallbackToCacheTimeout: 0
};
else config.updates = { enabled: false };
module.exports = { expo: config };
