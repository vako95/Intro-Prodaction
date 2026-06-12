import { useNavbarNav } from "../../../../../constants/navigations";
import MenuItem from "./components/MenuItem/MenuItem";

import "./Menu.css";

const Menu = () => {
    const navbarNav = useNavbarNav();
    
    return (
        <ul className="menu">
            {navbarNav.map((item) => (
                <MenuItem item={item} key={item.id} />
            ))}
        </ul>
    )
}

export default Menu;