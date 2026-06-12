import Brand from "./components/Brand/Brand.jsx";
import Content from "./components/Content/Content.jsx";
import Social from "./components/Social/Social.jsx";

import "./About.css";


const About = () => {

    return (
        <div className="footer__about">
            <Brand />
            <Content />
            <Social />
        </div>
    )
}

export default About;