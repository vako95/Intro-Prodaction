import { Container } from "@components/ui";
import { Link } from "react-router-dom";
import { useLang } from "@hooks/useLang";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useState, useEffect } from 'react';
import 'swiper/css';
import "./Topbar.css";

const Topbar = () => {
    const { getTranslate } = useLang();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const supportItems = [
        {
            icon: "ri-mail-fill",
            text: "needhelp@company.com",
            link: "mailto:needhelp@company.com"
        },
        {
            icon: "ri-map-pin-2-line",
            text: getTranslate("topbar", "address"),
            link: "#"
        },
        {
            icon: "ri-time-line",
            text: getTranslate("topbar", "workingHours"),
            link: "#"
        }
    ];

    const socialItems = [
        { icon: "ri-twitter-x-fill", link: "#" },
        { icon: "ri-youtube-fill", link: "#" },
        { icon: "ri-linkedin-fill", link: "#" },
        { icon: "ri-instagram-line", link: "#" }
    ];

    return (
        <Container>
            <nav className="topbar">
                {isMobile ? (
                    <div className="topbar__mobile">
                        <Swiper
                            modules={[Autoplay]}
                            direction="vertical"
                            spaceBetween={0}
                            slidesPerView={1}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            loop={true}
                            className="topbar__swiper"
                        >
                            {supportItems.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <div className="topbar__support topbar__support--mobile">
                                        <Link to={item.link} className="topbar__support-link">
                                            <i className={`topbar__support-link-icon ${item.icon}`}></i>
                                            <span className="topbar__support-link-title">
                                                {item.text}
                                            </span>
                                        </Link>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <ul className="topbar__socials topbar__socials--mobile">
                            {socialItems.map((item, index) => (
                                <li key={index} className="topbar__social">
                                    <Link to={item.link} className="topbar__social-link">
                                        <i className={`topbar__social-link-icon ${item.icon}`}></i>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="topbar__content">
                        <ul className="topbar__supports">
                            {supportItems.map((item, index) => (
                                <li key={index} className="topbar__support">
                                    <Link to={item.link} className="topbar__support-link">
                                        <i className={`topbar__support-link-icon ${item.icon}`}></i>
                                        <span className="topbar__support-link-title">
                                            {item.text}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <ul className="topbar__socials">
                            {socialItems.map((item, index) => (
                                <li key={index} className="topbar__social">
                                    <Link to={item.link} className="topbar__social-link">
                                        <i className={`topbar__social-link-icon ${item.icon}`}></i>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </nav>
        </Container>
    );
};

export default Topbar;