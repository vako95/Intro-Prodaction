import NavigationList from "./components/NavigationList/NavigationList.jsx";
import { useLang } from "@hooks/useLang";

import "./Navigation.css";

const Navigation = () => {
    const { getTranslate } = useLang();
    
    return (
        <nav className="footer__navigation">
            <div className="footer__navigation-heading">
                <h5 className="footer__navigation-title">
                    {getTranslate("footer", "servicesLinks")}
                </h5>
            </div>
            <NavigationList />
        </nav>
    )
}

export default Navigation;