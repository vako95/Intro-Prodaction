import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useTimer } from 'react-timer-hook';
import { socialLinks } from '../../../constants/socials';
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@hooks/useLang";
import { useSettings } from "../../../hooks/useSettings";
import "./Maintenance.css";
import maintenceLogo from "./assets/img/logo-wide-white.png";
import { ICON_MAP } from "@constants/map.js";
import { Container } from "@components/ui";
import { useMemo } from "react";

const particlesCount = 60;
const images = [
    { id: 1, src: "https://wallpapers.com/images/high/restaurant-in-grand-resort-lagonissi-greece-znonmfdj26fii6ol.webp" },
    { id: 2, src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 3, src: "https://media.cntraveler.com/photos/5a68c6949e34830eca77d87b/16:9/w_1920,c_limit/Beekman_2018_Beekman_BarRoom.jpg" },
];

const Maintenance = () => {
    const { getTranslate, lang } = useLang();
    const { data: settings, isLoading } = useSettings();
    
    const defaultTime = useMemo(() => {
        const time = new Date();
        time.setDate(time.getDate() + 2);
        return time;
    }, []);

    const finalTimestamp = useMemo(() => {
        if (settings?.maintenance_end_time) {
            return new Date(settings.maintenance_end_time);
        }
        return defaultTime;
    }, [settings, defaultTime]);

    const {
        seconds,
        minutes,
        hours,
        days,
    } = useTimer({
        expiryTimestamp: finalTimestamp
    });

    const [imgIdx, setImgIdx] = useState(0);

    const getMaintenanceMessage = () => {
        if (!settings) return {
            title: "Coming Soon, Stay Tuned!",
            description: "Our website is under construction. We are working on something really amazing!"
        };
        
        switch(lang) {
            case 'az':
                return {
                    title: settings.maintenance_message_az || "Tezliklə, Bizimlə Qalın!",
                    description: settings.maintenance_description_az || "Veb saytımız hazırlanır. Biz həqiqətən heyrətamiz bir şey üzərində işləyirik!"
                };
            case 'ru':
                return {
                    title: settings.maintenance_message_ru || "Скоро, Оставайтесь с нами!",
                    description: settings.maintenance_description_ru || "Наш сайт находится в разработке. Мы работаем над чем-то действительно удивительным!"
                };
            default:
                return {
                    title: settings.maintenance_message_en || "Coming Soon, Stay Tuned!",
                    description: settings.maintenance_description_en || "Our website is under construction. We are working on something really amazing!"
                };
        }
    };

    const maintenanceMessage = getMaintenanceMessage();

    useEffect(() => {
        let lastTime = performance.now();
        const interval = 5000
        let frameId = null
        const step = (timeStamp) => {
            const delta = timeStamp - lastTime
            if (delta >= interval) {
                setImgIdx((prev) => prev >= images.length - 1 ? 0 : prev + 1)

                lastTime = timeStamp;
            }
            frameId = requestAnimationFrame(step);
        }
        frameId = requestAnimationFrame(step)
        return () => cancelAnimationFrame(frameId);
    }, [])

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, rgba(10, 9, 8, 1) 0%, rgba(26, 22, 20, 1) 50%, rgba(10, 9, 8, 1) 100%)',
                color: 'rgba(170, 132, 83, 1)',
                fontFamily: '"Gilda Display", sans-serif',
                fontSize: '24px'
            }}>
                Loading...
            </div>
        );
    }

    return (
        <>
            <div className="maintenance">
                {/* Animated particles background */}
                <div className="maintenance__particles">
                    {[...Array(particlesCount)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="maintenance__particle"
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: Math.random() * window.innerHeight,
                                scale: Math.random() * 0.5 + 0.5,
                            }}
                            animate={{
                                x: Math.random() * window.innerWidth,
                                y: Math.random() * window.innerHeight,
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

                <div className="maintenance__slider">
                    <div className="maintenance__slider-backdrop"
                        style={{
                            backgroundImage: `url(${images[imgIdx].src})`
                        }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={imgIdx}
                                src={images[imgIdx].src}
                                className="maintenance__slider-backdrop-img"
                                initial={{ opacity: 0, scale: 1.6 }}
                                animate={{ opacity: 1, scale: 1.4 }}
                                exit={{ opacity: 1, scale: 1 }}
                                transition={{
                                    opacity: { duration: 1, ease: 'easeInOut' },
                                    scale: { duration: 6, ease: 'easeInOut' },
                                }}
                            />
                        </AnimatePresence>
                    </div>
                </div>

                <Container>
                    <motion.div
                        className="maintenance__content"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="maintenance__content maintenance__content--left">
                            <div className="maintenance__about">
                                <motion.div
                                    className="maintenance__about-wrapper"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{
                                        duration: 1,
                                        ease: "easeOut",
                                        delay: 0.2
                                    }}
                                >
                                    <img className="maintenance__about-wrapper-img" src={maintenceLogo} alt="" />
                                    <div className="maintenance__logo-glow" />
                                </motion.div>

                                <motion.div
                                    className="maintenance__about-item"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                >
                                    <h2 className="maintenance__about-item-title">
                                        <span className="maintenance__title-gradient">{maintenanceMessage.title}</span>
                                    </h2>
                                    <span className="maintenance__about-item-desc">
                                        {maintenanceMessage.description}
                                    </span>
                                    <div className="maintenance__decorative-line" />
                                </motion.div>

                                <motion.div
                                    className="maintenance__about-social"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                >
                                    <div className="maintenance__about-social-heading">
                                        <span className="maintenance__about-social-heading-title">
                                            Connect With Us
                                        </span>
                                    </div>
                                    <ul className="maintenance__about-social-list">
                                        {socialLinks.map((item, index) => {
                                            const Icon = ICON_MAP[item.icon] ?? ICON_MAP.default;
                                            return (
                                                <motion.li
                                                    className="maintenance__about-social-item"
                                                    key={item.id}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: 0.8 + index * 0.1
                                                    }}
                                                    whileHover={{
                                                        scale: 1.2,
                                                        rotate: [0, -10, 10, 0],
                                                        transition: { duration: 0.3 }
                                                    }}
                                                >
                                                    <Link to={item.url || "#"}>
                                                        <h2 className="maintenance__about-social-item-icon">
                                                            <Icon />
                                                        </h2>
                                                    </Link>
                                                </motion.li>
                                            );
                                        })}
                                    </ul>
                                </motion.div>
                            </div>
                        </div>

                        <div className="maintenance__content maintenance__content--right">
                            <div className="maintenance__timer">
                                <motion.div
                                    className="maintenance__timer-heading"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                >
                                    <h2 className='maintenance__timer-heading-title'>
                                        The maintenance will end on
                                    </h2>
                                </motion.div>

                                <div className="maintenance__timer-content">
                                    {[
                                        { value: days, label: 'Days' },
                                        { value: hours, label: 'Hours' },
                                        { value: minutes, label: 'Minutes' },
                                        { value: seconds, label: 'Seconds' }
                                    ].map((unit, index) => (
                                        <motion.div
                                            key={unit.label}
                                            className="maintenance__timer-unit"
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.6,
                                                delay: 0.5 + index * 0.1
                                            }}
                                            whileHover={{
                                                scale: 1.05,
                                                boxShadow: "0 0 30px rgba(170, 132, 83, 0.5)"
                                            }}
                                        >
                                            <motion.span
                                                className="maintenance__timer-unit-value"
                                                key={unit.value}
                                                initial={{ scale: 1.2, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {String(unit.value).padStart(2, '0')}
                                            </motion.span>
                                            <h2 className="maintenance__timer-unit-title">
                                                {unit.label}
                                            </h2>
                                            <div className="maintenance__timer-unit-glow" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Container>
            </div>
        </>
    );
}

export default Maintenance;