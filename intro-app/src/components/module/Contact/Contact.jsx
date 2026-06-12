import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import { useLang } from "@hooks/useLang";
import "./Contact.css";

import { PiPhoneCallThin } from 'react-icons/pi';
import { PiEnvelopeThin } from 'react-icons/pi';
import { PiMapPinThin } from 'react-icons/pi';
import ContactMap from "./ContactMap/ContactMap";
import { Container, CalendarFrame } from "@components/ui";
import { useHotelContactInfo } from "@/hooks/useContact";

const Contact = () => {
    const { getTranslate, lang } = useLang();
    const navigate = useNavigate();
    const { data: contactInfo, isLoading } = useHotelContactInfo();
    const [mapCenter, setMapCenter] = useState([49.82883763843378, 40.38539251517137]);

    useEffect(() => {
        if (contactInfo?.longitude && contactInfo?.latitude) {
            setMapCenter([contactInfo.longitude, contactInfo.latitude]);
        }
    }, [contactInfo]);
    
    const address = useMemo(() => {
        if (!contactInfo) return getTranslate("fallback", "hotelAddress");
        
        switch(lang) {
            case 'az':
                return contactInfo.address_az || contactInfo.address_en || getTranslate("fallback", "hotelAddress");
            case 'ru':
                return contactInfo.address_ru || contactInfo.address_en || getTranslate("fallback", "hotelAddress");
            default:
                return contactInfo.address_en || getTranslate("fallback", "hotelAddress");
        }
    }, [contactInfo, lang, getTranslate]);

    const handleCalendarSubmit = useCallback((e) => {
        const target = e.target;
        if (target.classList.contains('calendar-frame__submit') || target.closest('.calendar-frame__submit')) {
            e.preventDefault();
            
            const calendarFrame = document.querySelector('.contact__calendar-frame');
            if (calendarFrame) {
                const checkInElement = calendarFrame.querySelector('[data-check-in]');
                const checkOutElement = calendarFrame.querySelector('[data-check-out]');
                const roomsElement = calendarFrame.querySelector('[data-rooms]');
                const adultsElement = calendarFrame.querySelector('[data-adults]');
                const childrenElement = calendarFrame.querySelector('[data-children]');
                
                const dateElements = calendarFrame.querySelectorAll('.calendar-frame__dates-item-value');
                const labelElements = calendarFrame.querySelectorAll('.calendar-frame__label-item-count');
                
                let checkIn, checkOut, rooms, adults, children;
                
                if (dateElements.length >= 2) {
                    checkIn = dateElements[0]?.textContent?.trim();
                    checkOut = dateElements[1]?.textContent?.trim();
                }
                
                if (labelElements.length >= 3) {
                    rooms = parseInt(labelElements[0]?.textContent?.trim()) || 1;
                    adults = parseInt(labelElements[1]?.textContent?.trim()) || 1;
                    children = parseInt(labelElements[2]?.textContent?.trim()) || 0;
                }
                
                const filters = {
                    check_in: checkIn ? dayjs(checkIn, 'DD/MM/YYYY').format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
                    check_out: checkOut ? dayjs(checkOut, 'DD/MM/YYYY').format('YYYY-MM-DD') : dayjs().add(1, 'day').format('YYYY-MM-DD'),
                    rooms_count: rooms || 1,
                    adults: adults || 1,
                    children: children || 0
                };
                
                navigate('/rooms', { state: { filters } });
            }
        }
    }, [navigate]);

    useEffect(() => {
        document.addEventListener('click', handleCalendarSubmit);
        return () => document.removeEventListener('click', handleCalendarSubmit);
    }, [handleCalendarSubmit]);

    if (isLoading) {
        return <div>{getTranslate("common", "loading")}</div>;
    }

    return (
        <section className="contact">
            <Container>
                <div className="contact__wrapper">
                    <div className="contact__columns">
                        <div className="contact__column contact__column--left">
                            <div className="contact__column-content contact__calendar-wrapper">
                                <CalendarFrame 
                                    title={getTranslate("contact", "bookYourStay")}
                                    subtitle={getTranslate("contact", "reserveYourRoom")}
                                    padding={false}
                                    noContainer={true}
                                    className="contact__calendar-frame"
                                />
                            </div>
                        </div>

                        <div className="contact__column contact__column--right">
                            <div className="contact__column-content">
                                <div className="contact__heading">
                                    <h1 className="contact__heading-title">
                                        {getTranslate("contact", "needHelp")}
                                    </h1>
                                    <h2 className="contact__heading-subtitle">
                                        {getTranslate("contact", "getInTouchWithUs")}
                                    </h2>
                                    <span className="contact__heading-desc">
                                        {getTranslate("contact", "contactDescription")}
                                    </span>
                                </div>

                                <ul className="contact__list">
                                    <li className="contact__item">
                                        <div className="contact__item-wrapper">
                                            <PiPhoneCallThin className="contact__item-wrapper-icon" />
                                        </div>
                                        <div className="contact__item-content">
                                            <h1 className="contact__item-heading-title">
                                                {getTranslate("contact", "haveQuestion")}
                                            </h1>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                                <Link className="contact__item-link" to={`tel:${contactInfo?.phone_primary || ''}`}>
                                                    {contactInfo?.phone_primary || getTranslate("fallback", "defaultPhone")}
                                                </Link>
                                                {contactInfo?.phone_secondary && (
                                                    <Link className="contact__item-link" to={`tel:${contactInfo.phone_secondary}`}>
                                                        {contactInfo.phone_secondary}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                    <li className="contact__item">
                                        <div className="contact__item-wrapper">
                                            <PiEnvelopeThin className="contact__item-wrapper-icon" />
                                        </div>
                                        <div className="contact__item-content">
                                            <h1 className="contact__item-heading-title">
                                                {getTranslate("contact", "writeEmail")}
                                            </h1>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                                <Link className="contact__item-link" to={`mailto:${contactInfo?.email_primary || ''}`}>
                                                    {contactInfo?.email_primary || getTranslate("fallback", "defaultEmail")}
                                                </Link>
                                                {contactInfo?.email_secondary && (
                                                    <Link className="contact__item-link" to={`mailto:${contactInfo.email_secondary}`}>
                                                        {contactInfo.email_secondary}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                    <li className="contact__item">
                                        <div className="contact__item-wrapper">
                                            <PiMapPinThin className="contact__item-wrapper-icon" />
                                        </div>
                                        <div className="contact__item-content">
                                            <h1 className="contact__item-heading-title">
                                                {getTranslate("contact", "visitUs")}
                                            </h1>
                                            <span className="contact__item-link">
                                                {address}
                                            </span>
                                        </div>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            <div className="content-map">
                <ContactMap center={mapCenter} />
            </div>
        </section>

    );
};

export default Contact;
