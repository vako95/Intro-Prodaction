import { HoverLink, DecoratedHeading } from "@components/ui";
import { useLang } from "@hooks/useLang";
import "./Decorate.css";

const Decorate = ({ item }) => {
    const { getTranslate } = useLang();

    return (
        <div className="swap__holder-decorate">
            <DecoratedHeading
                className="swap__holder-text"
                fontFamily="'Barlow Condensed', sans-serif"
                showLeftIcon={false}
                position="start"
                label={item?.label}
                title={item?.title}
                desc={item?.content}
            />
            <div className="swap__holder-btn">
                <HoverLink
                    to="/rooms"
                    border={false}
                    borderColor="rgba(170, 132, 83, 1)"
                    fontSize="14px"
                    size="md"
                    variant="black"
                >
                    {getTranslate("feature", "discoverMore")}
                </HoverLink>
            </div>
        </div>
    )
}

export default Decorate;