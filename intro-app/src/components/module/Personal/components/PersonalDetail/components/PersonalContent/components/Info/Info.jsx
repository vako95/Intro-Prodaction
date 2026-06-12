import { useLang } from "@hooks/useLang";

const Info = ({ member }) => {
    const { getTranslate } = useLang();
    if (!member) return null;
    
    return (
        <ul className="personal__detail-info-list">
            <li className="personal__detail-info-item">
                <strong className="personal__detail-info-item-label">
                    {getTranslate("personal", "email")}:
                </strong >
                <span className="personal__detail-info-item-value">
                    {member.email || getTranslate("personal", "na")}
                </span>
            </li>
            <li className="personal__detail-info-item">
                <strong className="personal__detail-info-item-label">
                    {getTranslate("personal", "bloodGroup")}:
                </strong>
                <span className="personal__detail-info-item-value">
                    {member.blood_group || getTranslate("personal", "na")}
                </span>
            </li>
            <li className="personal__detail-info-item">
                <strong className="personal__detail-info-item-label">
                    {getTranslate("personal", "phone")}:
                </strong>
                <span className="personal__detail-info-item-value">
                    {member.phone || getTranslate("personal", "na")}
                </span>
            </li>
            <li className="personal__detail-info-item">
                <strong className="personal__detail-info-item-label">
                    {getTranslate("personal", "age")}:
                </strong>
                <span className="personal__detail-info-item-value">
                    {member.age ? `${member.age} ${getTranslate("personal", "years")}` : getTranslate("personal", "na")}
                </span>
            </li>
            <li className="personal__detail-info-item">
                <strong className="personal__detail-info-item-label">
                    {getTranslate("personal", "website")}:
                </strong>
                <span className="personal__detail-info-item-value">
                    {member.website || getTranslate("personal", "na")}
                </span>
            </li>
            <li className="personal__detail-info-item">
                <strong className="personal__detail-info-item-label">
                    {getTranslate("personal", "address")}:
                </strong>
                <span className="personal__detail-info-item-value">
                    {member.address || getTranslate("personal", "na")}
                </span>
            </li>
        </ul>
    )
}

export default Info;