import { Container } from "../../ui";
import About from "./components/About/About";
import Contact from "./components/Contacts/Contact";
import Copyright from "./components/Copyright/Copyright";
import Navigation from "./components/Navigation/Navigation";
import Subscribe from "./components/Subcribe/Subscribe";


import "./Footer.css";

const Footer = () => {

    return (
        <footer tabIndex={0} className="footer">
            <Container>
                <div className="footer__container">
                    <About />
                    <Navigation />
                    <Contact />
                    <Subscribe />
                </div>
                <Copyright />
            </Container>
        </footer>
    )
}

export default Footer;