import "./SkillsDescription.css";
import { useLang } from "@hooks/useLang";

const SkillsDescription = ({ member }) => {
    const { getTranslate } = useLang();

    return (
        <article className="personal__detail-skills">
            <div className="personal__detail-skills-heading">
                <h4 className="personal__detail-skills-title">{getTranslate("personal", "expertiseSkills")}</h4>
            </div>

            <div className="personal__detail-skills-content">
                <span className="personal__detail-skills-desc">
                    {member?.bio}
                </span>
            </div>
        </article>
    );
};

export default SkillsDescription;
