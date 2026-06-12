import { FadeInLeft, FadeInRight, IconMirror, } from "@components/animation";
import { HoverLink, DecoratedHeading } from "@components/ui"
import { useLang } from "@hooks/useLang";
import { useHotelContactInfo } from "@hooks/useContact";
import { Link } from "react-router-dom";
import phoneCallIcon from "./assets/icon/phone-call.png";
import "./Feature.css";




const Feature = ({ item }) => {
    const { getTranslate } = useLang();
    const { data: contactInfo } = useHotelContactInfo();
    return (
        <div className="section__feature">
            <div className="section__feature-heading">
                <DecoratedHeading
                    position="start"
                    showLeftIcon={false}
                    showRightIcon={true}
                    title={item?.feature?.title || getTranslate("feature", "noData")}
                    subtitle={item?.feature?.subtitle}
                />
            </div>
            <div className="section__feature-info">

                <FadeInLeft>
                    <span className="section__feature-info-summary"
                        dangerouslySetInnerHTML={{ __html: item?.feature?.short_content }}
                    >
                    </span>
                </FadeInLeft>

                <FadeInRight>
                    <p className="section__feature-info-desc"
                        dangerouslySetInnerHTML={{ __html: item?.feature?.content }}
                    >

                    </p>
                </FadeInRight>
            </div>

            <div className="section__feature-points">
                {item?.feature_items?.map((featureItem) => (
                    <IconMirror key={featureItem.id || featureItem.title}>
                        <div className="section__feature-points-item">
                            <div className="section__feature-points-wrapper">
                                <img src={featureItem.icon} className="anime-mirror section__feature-points-img" alt="pool" />
                            </div>
                            <h5 className="section__feature-points-title">
                                {featureItem.title}
                            </h5>
                        </div>
                    </IconMirror>
                ))}
                <div className="section__feature-points-item">
                    <HoverLink
                        size="md"
                        border={true}
                        color="white"
                        variant="gold"
                        className="section__feature-points-item-btn"
                        to="/facilities"
                    >
                        {getTranslate("feature", "discoverMore")}
                    </HoverLink>
                </div>
                <IconMirror >
                    <div className="section__feature-points-item">
                        <div className="section__feature-points-wrapper">
                            <img src={phoneCallIcon} className="anime-mirror section__feature-points-img" alt="phone" />
                        </div>
                        <h5 className="section__feature-points-title">
                            <span>
                            {getTranslate("feature", "bookingNow")}
                            </span>
                            <Link 
                                to={`tel:${contactInfo?.phone_primary || ''}`}
                                className="section__feature-points-num"
                            >
                                {contactInfo?.phone_primary || getTranslate("fallback", "defaultPhone")}
                            </Link>
                        </h5>
                    </div>
                </IconMirror >
            </div>
        </div>
    )
}

export default Feature;
