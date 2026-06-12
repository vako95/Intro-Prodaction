import { FadeInLeft, FadeInRight, FadeInWordRight, IconMirror } from "@components/animation";
import { DecoratedHeading } from "@components/ui";
import { useLang } from "@hooks/useLang";
import phone from "./assets/icon/phone.png";
import "./BookingAside.css";

const BookingAside = () => {
    const { getTranslate } = useLang();

    return (
        <div className="hotel-booking__aside">
            <div className="hotel-booking__aside-container">
                <div className="hotel-booking__aside-heading">
                    <DecoratedHeading
                        className="hotel-booking__aside-title"
                        position="start"
                        showLeftIcon={false}
                        showRightIcon={true}
                        title={getTranslate("booking", "hotelTitle")}
                        subtitle={getTranslate("booking", "checkAvailability")}
                    />
                </div>

                <div className="hotel-booking__aside-content">
                    <div className="hotel-booking__aside-text">
                        <div className="hotel-booking__aside-text-wrapper">
                            <FadeInRight>
                                <p className="hotel-booking__aside-paragraph">
                                    {getTranslate("booking", "roomFeatures")}
                                </p>
                            </FadeInRight>
                            <FadeInLeft>
                                <p className="hotel-booking__aside-paragraph">
                                    Mea nibh meis philosophia eu. Duis legimus efficiantur ea sea.
                                    Id placerat tacimates definitionem sea, prima quidam vim no.
                                    Duo nobis persecuti cu.
                                </p>
                            </FadeInLeft>
                        </div>

                    </div>

                    <div className="hotel-booking__aside-contact">
                        <IconMirror>
                            <div className="hotel-booking__aside-icon-holder">

                                <img className="anime-mirror hotel-booking__aside-icon" src={phone} alt="" />
                            </div>
                        </IconMirror>

                        <div className="hotel-booking__aside-phone">
                            <span className="hotel-booking__aside-phone-label">{getTranslate("booking", "bookingNow")}</span>
                            <a className="hotel-booking__aside-phone-number" href="tel:+1234567890" > {"+944 (50) 673-20-59".split("").map((char, idx) => (
                                <FadeInWordRight custom={idx} key={idx} direction="up">
                                    {char}
                                </FadeInWordRight>
                            ))}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingAside;