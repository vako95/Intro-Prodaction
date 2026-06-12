import clsx from "clsx";
import "./SubsCribeCheckBox.css";

const SubsCribeCheckBox = ({ color = "green", className, children, checked, onChange }) => {

    const classes = clsx(
        "footer__subscribe-form-input-checkbox",
        className,
        color === "gold" && "subscribe__checkbox-gold",
        color === "green" && "subscribe__checkbox-green"
    );

    return (
        <div className={classes}>
            <input 
                type="checkbox" 
                id="newsletter-terms" 
                className="subscribe__checkbox-input"
                checked={checked}
                onChange={onChange}
            />
            <label htmlFor="newsletter-terms" className="footer__subscribe-form-label">
                <p className="subscribe__checkbox-title">{children}</p>
            </label>
        </div>

    );
};

export default SubsCribeCheckBox;
