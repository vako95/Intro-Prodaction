import { useState, useEffect } from 'react';

const getInitialPreferences = (settings) => {
  const saved = localStorage.getItem('userPreferences');
  
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        customCursor: parsed.customCursor || false,
        splashScreen: parsed.splashScreen !== false
      };
    } catch (e) {
      return {
        customCursor: settings?.enable_custom_cursor || false,
        splashScreen: settings?.enable_splash_screen !== false
      };
    }
  }
  
  return {
    customCursor: settings?.enable_custom_cursor || false,
    splashScreen: settings?.enable_splash_screen !== false
  };
};

export const usePreferences = (settings) => {
  const [preferences, setPreferences] = useState(() => getInitialPreferences(settings));

  useEffect(() => {
    const handleChange = (e) => {
      setPreferences({
        customCursor: e.detail.customCursor,
        splashScreen: e.detail.splashScreen
      });
    };

    window.addEventListener('preferencesChanged', handleChange);
    return () => window.removeEventListener('preferencesChanged', handleChange);
  }, []);

  useEffect(() => {
    if (settings && !localStorage.getItem('userPreferences')) {
      queueMicrotask(() => {
        setPreferences({
          customCursor: settings.enable_custom_cursor || false,
          splashScreen: settings.enable_splash_screen !== false
        });
      });
    }
  }, [settings]);

  return preferences;
};
