import { BackdropContainer } from "@components/ui";
import bgShape from "./assets/img/bg-shape-1.png";
import clsx from "clsx";
import "./Unavailable.css";
import { MdErrorOutline } from "react-icons/md";

const Unavailable = ({
    icon = <MdErrorOutline />,
    title,
    message,
    className
}) => {

    const classes = clsx(
        "unavailable",
        className
    );

    return (
        <div className={classes}>
            <BackdropContainer backdrop={bgShape} width="100%" fullScreen={false} animation={true} >
                <div className="unavailable__container">
                    <div className="unavailable__heading">
                        {icon &&
                            <span className="unavailable__heading-icon">
                                {icon}
                            </span>
                        }
                        {title &&
                            <h3 className="unavailable__heading-title">
                                {title}
                            </h3>}
                    </div>
                    <div className="unavailable__content">
                        {message &&
                            <span className="unavailable__message">
                                {message}
                            </span>
                        }
                    </div>

                </div>
            </BackdropContainer>
        </div>
    );
};

export default Unavailable;
