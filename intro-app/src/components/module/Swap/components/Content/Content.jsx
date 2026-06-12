
import "./Content.css";



const Content = ({ children }) => {

    return (
        <article className="swap__content">
            <div className="swap__content-box">
                <div className="swap__heading">
                    <div className="swap__holder">
                        {children}
                    </div>
                </div>
            </div>
        </article>
    )
}

export default Content;