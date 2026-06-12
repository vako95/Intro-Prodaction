import ContactList from "./components/ContactList/ContactList.jsx";
import { useLang } from "@hooks/useLang";
import "./Contact.css";

const Contact = () => {
    const { getTranslate } = useLang();

    return (
        <div className="footer__contacts">
            <div className="footer__contacts-heading">
                <h5 className="footer__contacts-title">
                    {getTranslate("footer", "information")}
                </h5>
            </div>
            <div className="footer__contacts-content">
                <ContactList />
            </div>
        </div>
    )
}

export default Contact;