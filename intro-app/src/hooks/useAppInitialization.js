import { useSettings } from "@/hooks/useSettings";
import { useHotelContactInfo } from "@/hooks/useContact";
import { usePreferences } from "@/hooks/usePreferences";

export const useAppInitialization = () => {
  const { data: settings, isLoading: settingsLoading } = useSettings();
  const { isLoading: contactLoading } = useHotelContactInfo();
  const { splashScreen } = usePreferences(settings);

  const isDataLoading = settingsLoading || contactLoading;
  const showSplash = splashScreen && isDataLoading;

  return {
    showSplash,
    isLoading: isDataLoading
  };
};
