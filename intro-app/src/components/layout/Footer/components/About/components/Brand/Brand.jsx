import { Link } from "react-router-dom";
import LogoBrand from "./assets/img/logo/logo-wide-white.png";
import "./Brand.css";
const Brand = () => {

    return (
        <div className="footer__about-brand">
            <div className="footer__about-img">
                <Link className="footer__about-link">
                    <img src={LogoBrand} alt="logo__brand" className="footer__about-link-brand" />
                </Link>
            </div>
        </div>
    )
}

export default Brand;