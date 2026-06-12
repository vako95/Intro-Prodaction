import "./ContactList.css";

import ContactItem from "./components/ContactItem.jsx";
const items = [
    { id: 1, label: "1800-121-3637", to: "#", target: "_self", icon: "phone" },
    { id: 2, label: "needhelp@company.com", to: "#", target: "_self", icon: "email" },
    { id: 3, label: "1247/Plot No. 39, 15th Phase, United States of America", to: "#", target: "_blank", icon: "location" },
]
const ContactList = () => {

    return (
        <ul className="footer__contacts-list">
            {items.map((item) => (
                <ContactItem key={item.id} item={item} />
            ))}
        </ul>
    )
}

export default ContactList;