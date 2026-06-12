const SkillBar = ({ name, value, targetValue, visible }) => {

    return (
        <li className="personal__detail-skills-item">
            <div className="personal__detail-skills-content">
                <span className="personal__detail-skills-name">{name}</span>
            </div>
            <div className="personal__detail-skills-bar">
                <div className="personal__detail-skills-progress"
                    style={{
                        width: visible ? `${targetValue}%` : "0%",
                    }}>
                </div>
                <span className="personal__detail-skills-value">{value}%</span>
            </div>
        </li>
    );
};

export default SkillBar;
