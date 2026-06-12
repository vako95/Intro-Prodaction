import { useLang } from "@hooks/useLang";
import "./Heading.css";

const Heading = ({ member }) => {
    const { getTranslate } = useLang();
    if (!member) return null;
    
    return (
        <div className="personal__detail-content-heading">
            <h2 className="personal__detail-name">{member.name || 'Name'}</h2>
            <p className="personal__detail-desc">
                {member.bio || getTranslate("personal", "noDescriptionAvailable")}
            </p>
        </div>
    )
}

export default Heading;