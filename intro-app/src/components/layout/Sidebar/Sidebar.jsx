import { useContext, useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { RiLoginBoxLine, RiUserAddLine, RiLogoutBoxLine, RiUserLine, RiShoppingBagLine } from "react-icons/ri";
import { FiChevronDown } from "react-icons/fi";
import Logo from "../Navbar/components/Logo/Logo";
import Menu from "../Navbar/components/Menu/Menu";
import Cart from "../Navbar/components/Cart/Cart";
import { WishlistIcon } from "../Navbar/components/WishlistIcon";
import { LangContext } from "../../../context/lang.jsx";
import { AVAILABLE_LANGS } from "../../../constants/lang.js";
import { AuthService } from "../../../services/auth.js";
import { useLang } from "@hooks/useLang";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { getLang, changeLanguage } = useContext(LangContext);
    const { getTranslate } = useLang();
    const navigate = useNavigate();
    
    const isAuthenticated = AuthService.isAuthenticated();
    const user = AuthService.getUser();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const toggleLang = useCallback((e) => {
        e.stopPropagation();
        setIsLangOpen((prev) => !prev);
        setIsProfileOpen(false);
    }, []);

    const toggleProfile = useCallback((e) => {
        e.stopPropagation();
        setIsProfileOpen((prev) => !prev);
        setIsLangOpen(false);
    }, []);

    const handleLanguageChange = useCallback((code) => {
        changeLanguage(code);
        setIsLangOpen(false);
    }, [changeLanguage]);

    const handleClose = useCallback(() => {
        setIsLangOpen(false);
        setIsProfileOpen(false);
        onClose();
    }, [onClose]);

    const handleLogout = useCallback(() => {
        AuthService.logout();
        handleClose();
        navigate('/');
        window.location.reload();
    }, [navigate, handleClose]);

    const handleNavigation = useCallback((path) => {
        handleClose();
        navigate(path);
    }, [navigate, handleClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        className="sidebar__overlay" 
                        onClick={handleClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                    <motion.div
                        className="sidebar"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ 
                            type: "spring", 
                            damping: 30, 
                            stiffness: 300,
                            mass: 0.8
                        }}
                    >
                        <div className="sidebar__header">
                            <Logo />
                        </div>

                        <div className="sidebar__content">
                            <Menu />
                        </div>

                        <div className="sidebar__footer">
                            <div className={clsx("lang-switcher", isLangOpen && "lang-switcher--open")}>
                                <div className="lang-switcher__current" onClick={toggleLang}>
                                    <span className={`fi fi-${getLang().flag}`} />
                                    <span className="lang-switcher__current-label">{getLang().label}</span>
                                    <FiChevronDown className={clsx("lang-switcher__arrow", isLangOpen && "lang-switcher__arrow--open")} />
                                </div>

                                <div className="lang-switcher__dropdown">
                                    {AVAILABLE_LANGS.map((l, idx) => (
                                        <div
                                            key={idx}
                                            className={clsx(
                                                "lang-switcher__item",
                                                l.code === getLang().label &&
                                                    "lang-switcher__item--active"
                                            )}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLanguageChange(l.code);
                                            }}
                                        >
                                            <span className={`fi fi-${l.flag}`} />
                                            {l.label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {isAuthenticated ? (
                                <div className={clsx("sidebar__profile", isProfileOpen && "sidebar__profile--open")}>
                                    <div className="sidebar__profile-current" onClick={toggleProfile}>
                                        <div className="sidebar__profile-avatar">
                                            {user?.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.first_name} className="sidebar__profile-avatar-img" />
                                            ) : (
                                                <RiUserLine className="sidebar__profile-avatar-icon" />
                                            )}
                                        </div>
                                        <div className="sidebar__profile-info">
                                            <span className="sidebar__profile-name">
                                                {user?.first_name || 'User'} {user?.last_name || ''}
                                            </span>
                                            <span className="sidebar__profile-email">{user?.email || ''}</span>
                                        </div>
                                        <FiChevronDown className={clsx("sidebar__profile-arrow", isProfileOpen && "sidebar__profile-arrow--open")} />
                                    </div>

                                    <div className="sidebar__profile-dropdown">
                                        <button className="sidebar__profile-item" onClick={() => handleNavigation('/profile')}>
                                            <RiUserLine className="sidebar__profile-item-icon" />
                                            <span>{getTranslate("profile", "title")}</span>
                                        </button>
                                        <button className="sidebar__profile-item" onClick={() => handleNavigation('/profile?tab=orders')}>
                                            <RiShoppingBagLine className="sidebar__profile-item-icon" />
                                            <span>{getTranslate("profile", "orders")}</span>
                                        </button>
                                        <button className="sidebar__profile-item sidebar__profile-item--logout" onClick={handleLogout}>
                                            <RiLogoutBoxLine className="sidebar__profile-item-icon" />
                                            <span>{getTranslate("profile", "logout")}</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="sidebar__auth-buttons">
                                    <button className="sidebar__auth-btn sidebar__auth-btn--login" onClick={() => handleNavigation('/auth/login')}>
                                        <RiLoginBoxLine className="sidebar__auth-btn-icon" />
                                        <span>{getTranslate("auth", "login")}</span>
                                    </button>
                                    <button className="sidebar__auth-btn sidebar__auth-btn--register" onClick={() => handleNavigation('/auth/register')}>
                                        <RiUserAddLine className="sidebar__auth-btn-icon" />
                                        <span>{getTranslate("auth", "register", "registerButton")}</span>
                                    </button>
                                </div>
                            )}

                            <WishlistIcon showText={true} />
                            <Cart showText={true} />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Sidebar;
