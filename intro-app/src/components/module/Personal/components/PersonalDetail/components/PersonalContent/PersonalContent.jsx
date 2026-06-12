import "./PersonalContent.css";
import Info from "./components/Info/Info.jsx";
import Heading from "./components/Heading/Heading.jsx";
import Socials from "./components/Socials/Socials";

const PersonalContent = ({ member }) => {

    return (
        <article className="personal__detail-content">
            <Heading member={member} />
            <Info member={member} />
            <Socials member={member} />
        </article>
    )
}

export default PersonalContent;