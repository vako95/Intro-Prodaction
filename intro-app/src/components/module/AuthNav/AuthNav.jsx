import { NavLink, useLocation } from "react-router-dom";
import { RiLoginBoxLine } from "react-icons/ri";
import { PiUserCirclePlusDuotone } from "react-icons/pi";
import { RiLockPasswordLine } from "react-icons/ri";
import { useLang } from "@hooks/useLang";

import "./AuthNav.css";

const AuthNav = ({ children }) => {
    const { getTranslate } = useLang();
    const getLinkClass = ({ isActive }) =>
        isActive
            ? "auth-nav__link auth-nav__link--active"
            : "auth-nav__link";
    return (

        <div className="auth-nav">
            <div className="auth-nav__banner">
                <img className="auth-nav__banner-img" src="https://img.freepik.com/free-photo/black-white-photo-mall_250224-119.jpg?semt=ais_hybrid&w=740" alt="" />
            </div>
            <div className="auth-nav__container">
                <div className="auth-nav__content">
                    <NavLink to="/auth/login" className={getLinkClass}>
                        <RiLoginBoxLine className="auth-nav__icon" />
                        <h1 className="auth-nav__title">{getTranslate("auth", "loginPage", "loginButton")}</h1>
                    </NavLink>

                    <NavLink to="/auth/register" className={getLinkClass}>
                        <PiUserCirclePlusDuotone className="auth-nav__icon" />
                        <h1 className="auth-nav__title">{getTranslate("auth", "register", "registerButton")}</h1>
                    </NavLink>

                    <NavLink to="reset" end={false} className={getLinkClass}>
                        <RiLockPasswordLine className="auth-nav__icon" />
                        <h1 className="auth-nav__title">
                            {getTranslate("auth", "resetPassword", "title")}
                        </h1>
                    </NavLink>
                </div>
                {children}
            </div>
        </div>
    );
};

export default AuthNav;
