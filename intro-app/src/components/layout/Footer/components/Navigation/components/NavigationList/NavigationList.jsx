import NavigationItem from "./components/NavigationItem/NavigationItem.jsx";
import { useFooterNav } from "../../../../../../../constants/navigations.js";
import "./NavigationList.css";

const NavigationList = () => {
    const footerNav = useFooterNav();

    return (
        <ul className="footer__navigation-list">
            {footerNav.map((item, idx) => (
                <NavigationItem item={item} key={idx} />
            ))}
        </ul>
    )
}

export default NavigationList;