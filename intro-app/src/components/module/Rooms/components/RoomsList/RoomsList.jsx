import "./RoomsList.css";

const RoomsList = ({ children, viewMode = 'grid' }) => {

    return (
        <div className={`rooms__list rooms__list--${viewMode}`}>
            {children}
        </div>
    )
}

export default RoomsList;