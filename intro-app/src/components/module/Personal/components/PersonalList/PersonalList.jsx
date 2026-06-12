import "./PersonalList.css";
import "./PersonalList-responsive.css";

const PersonalList = ({ children }) => {
    return (
        <div className="personal__list">
            <div className="personal__list-wrapper">
                {children}
            </div>
        </div>
    )
}

export default PersonalList;