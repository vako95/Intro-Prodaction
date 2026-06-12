import { forwardRef } from "react";
import SkillBar from "./components/SkillBar/SkillBar";
import { useLang } from "@hooks/useLang";

const SkillsSection = forwardRef(({ skills, progresses, visible }, ref) => {
    const { getTranslate } = useLang();

    return (
        <section className="personal__detail-skills">
            <div className="personal__detail-skills-heading">
                <h4 className="personal__detail-skills-title">{getTranslate("personal", "expertiseSkills")}</h4>
            </div>
            <ul className="personal__detail-skills-list" ref={ref}>
                {skills.map((skill, idx) => (
                    <SkillBar
                        key={skill.name}
                        name={skill.name}
                        value={progresses[idx]}
                        targetValue={skill.value}
                        visible={visible}
                    />
                ))}
            </ul>
        </section>
    );
});

export default SkillsSection;
