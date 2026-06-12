import "./Heading.css";


const Heading = ({ item }) => {
    return (
        <div className="quote__item-heading">
            <h1 className="quote__item-heading-name">
                {item.name}
            </h1>
            <span className="quote__item-heading-role">
                {item.position}
            </span>
        </div>
    )
}


export default Heading;