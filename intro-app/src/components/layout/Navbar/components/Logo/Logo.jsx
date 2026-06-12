import { Link } from "react-router-dom";
import LogoBrand from "./assets/images/logo/logo-wide-white.png";

import "./Logo.css"


const Logo = () => {

    return (
        <figure className="logo">
            <Link to="/" className="logo__link">
                <img className="logo__brand" src={LogoBrand} alt="Logo brand" />
            </Link>
        </figure>
    )
}

export default Logo;