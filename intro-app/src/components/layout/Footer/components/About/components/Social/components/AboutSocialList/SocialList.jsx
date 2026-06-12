import SocialItem from "./components/SocialItem";

import "./SocialList.css";

const items = [
    { id: 1, icon: "instagram", to: "#" },
    { id: 2, icon: "facebook", to: "#" },
    { id: 3, icon: "youtube", to: "#" },
    { id: 4, icon: "twitter", to: "#" },
];

const SocialList = () => {

    return (
        <ul className="footer__about-social-links">
            {items.map((item) => (
                <SocialItem key={item.id} item={item} />
            ))}
        </ul>
    )
}
export default SocialList;