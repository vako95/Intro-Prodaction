import "./PerosnalWrapper.css";
import { useLang } from "@hooks/useLang";

const PerosnalWrapper = ({ member }) => {
    const { getTranslate } = useLang();

    return (
        <figure className="personal__detail-wrapper">
            <img
                className="personal__detail-wrapper-img"
                src={member?.poster || member?.image}
                alt={`${getTranslate("personal", "portraitOf")} ${member?.name}`}
            />
        </figure>
    )
}

export default PerosnalWrapper;