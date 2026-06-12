import { Link } from "react-router-dom";
import LogoBrand from "./assets/images/logo/logo-wide-white.png";
import { useLang } from "@/hooks/useLang";

import "./Logo.css"


const Logo = () => {
    const { getTranslate } = useLang();

    return (
        <figure className="navbar-sticky__logo">
            <Link to="/" className="navbar-sticky__logo-link">
                <img className="navbar-sticky__logo-img" src={LogoBrand} alt={getTranslate("altTexts", "logoBrand")} />
            </Link>
        </figure>
    )
}

export default Logo;