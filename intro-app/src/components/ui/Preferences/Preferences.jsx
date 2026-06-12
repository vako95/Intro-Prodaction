import { useState, useEffect, useCallback, memo } from 'react';
import { IoSettingsOutline, IoClose } from 'react-icons/io5';
import { useSettings } from '@/hooks/useSettings';
import { useLang } from '@hooks/useLang';
import './Preferences.css';

const Preferences = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: settings } = useSettings();
    const { getTranslate } = useLang();
    
    const [preferences, setPreferences] = useState({
        customCursor: false,
        splashScreen: true,
    });

    useEffect(() => {
        const saved = localStorage.getItem('userPreferences');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setPreferences(parsed);
            } catch (e) {
            }
        } else if (settings) {
            setPreferences({
                customCursor: settings.enable_custom_cursor || false,
                splashScreen: settings.enable_splash_screen !== false,
            });
        }
    }, [settings]);

    const savePreferences = useCallback((newPrefs) => {
        setPreferences(newPrefs);
        queueMicrotask(() => {
            try {
                localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
            } catch (e) {
            }
        });
        
        window.dispatchEvent(new CustomEvent('preferencesChanged', { 
            detail: newPrefs 
        }));
    }, []);

    const toggleCustomCursor = useCallback((e) => {
        e.stopPropagation();
        savePreferences({
            ...preferences,
            customCursor: !preferences.customCursor,
        });
    }, [preferences, savePreferences]);

    const toggleSplashScreen = useCallback((e) => {
        e.stopPropagation();
        savePreferences({
            ...preferences,
            splashScreen: !preferences.splashScreen,
        });
    }, [preferences, savePreferences]);

    const handleToggleOpen = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            const isToggleButton = e.target.closest('.preferences__toggle');
            const isInsidePreferences = e.target.closest('.preferences');
            
            if (!isToggleButton && !isInsidePreferences) {
                setIsOpen(false);
            }
        };

        requestAnimationFrame(() => {
            document.addEventListener('mousedown', handleClickOutside);
        });

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="preferences">
            <button 
                className="preferences__trigger"
                onClick={handleToggleOpen}
                aria-label={getTranslate("preferences", "openPreferences")}
            >
                <IoSettingsOutline className="preferences__trigger-icon" />
            </button>

            <div className={`preferences__panel ${isOpen ? 'preferences__panel--open' : ''}`}>
                <div className="preferences__header">
                    <h3 className="preferences__title">{getTranslate("preferences", "title")}</h3>
                    <button 
                        className="preferences__close"
                        onClick={handleClose}
                        aria-label={getTranslate("preferences", "closePreferences")}
                    >
                        <IoClose className="preferences__close-icon" />
                    </button>
                </div>

                <div className="preferences__content">
                    <div className="preferences__item">
                        <div className="preferences__item-info">
                            <span className="preferences__item-label">{getTranslate("preferences", "splashScreen")}</span>
                            <span className="preferences__item-description">
                                {getTranslate("preferences", "splashScreenDesc")}
                            </span>
                        </div>
                        <button
                            className={`preferences__toggle ${preferences.splashScreen ? 'preferences__toggle--active' : ''}`}
                            onClick={toggleSplashScreen}
                            aria-label={getTranslate("preferences", "toggleSplashScreen")}
                        >
                            <div className="preferences__toggle-slider"></div>
                        </button>
                    </div>

                    <div className="preferences__item">
                        <div className="preferences__item-info">
                            <span className="preferences__item-label">{getTranslate("preferences", "customCursor")}</span>
                            <span className="preferences__item-description">
                                {getTranslate("preferences", "customCursorDesc")}
                            </span>
                        </div>
                        <button
                            className={`preferences__toggle ${preferences.customCursor ? 'preferences__toggle--active' : ''}`}
                            onClick={toggleCustomCursor}
                            aria-label={getTranslate("preferences", "toggleCustomCursor")}
                        >
                            <div className="preferences__toggle-slider"></div>
                        </button>
                    </div>
                </div>

                <div className="preferences__footer">
                    <span className="preferences__footer-text">
                        {getTranslate("preferences", "savedLocally")}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default memo(Preferences);
