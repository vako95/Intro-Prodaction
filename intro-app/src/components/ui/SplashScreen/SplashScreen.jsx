import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@hooks/useLang';
import './SplashScreen.css';

const particlesCount = 20;

const SplashScreen = ({ isLoading = false }) => {
    const { getTranslate } = useLang();
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className={`splash-screen ${!isLoading ? 'splash-screen--hidden' : ''}`}>
            <div className="splash-screen__background">
                <div className="splash-screen__gradient"></div>
                <div className="splash-screen__particles">
                    {[...Array(particlesCount)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="splash-screen__particle"
                            initial={{
                                x: `${Math.random() * 100}vw`,
                                y: `${Math.random() * 100}vh`,
                                scale: Math.random() * 0.5 + 0.5,
                            }}
                            animate={{
                                x: `${Math.random() * 100}vw`,
                                y: `${Math.random() * 100}vh`,
                                opacity: [0.2, 0.8, 0.2],
                            }}
                            transition={{
                                duration: Math.random() * 10 + 10,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="splash-screen__content">
                <div className="splash-screen__logo-container">
                    <div className="splash-screen__logo-border">
                        <div className="splash-screen__logo-inner">
                            <h1 className="splash-screen__logo-text">
                                <span className="splash-screen__logo-letter">H</span>
                                <span className="splash-screen__logo-letter">O</span>
                                <span className="splash-screen__logo-letter">E</span>
                                <span className="splash-screen__logo-letter">X</span>
                                <span className="splash-screen__logo-letter">R</span>
                            </h1>
                        </div>
                    </div>
                    <div className="splash-screen__shine"></div>
                </div>

                <div className="splash-screen__subtitle">
                    <span className="splash-screen__subtitle-text">{getTranslate("food", "subtitle")}</span>
                </div>

                <div className="splash-screen__loader">
                    <div className="splash-screen__loader-track">
                        <div className="splash-screen__loader-progress"></div>
                    </div>
                    <div className="splash-screen__loader-glow"></div>
                </div>

                <div className="splash-screen__decorative-lines">
                    <div className="splash-screen__line splash-screen__line--left"></div>
                    <div className="splash-screen__line splash-screen__line--right"></div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
