
import RoomDetailsLeft from "./componnets/RoomDetailsLeft/RoomDetailsLeft";
import RoomDetailsRight from "./componnets/RoomDetailsRight/RoomDetailsRight";
import "./RoomDetailsColumns.css";


const RoomDetailsColumns = () => {


    return (
        <div className="rooms-details__columns">
            <RoomDetailsLeft />
            <RoomDetailsRight />
        </div>
    )
}

export default RoomDetailsColumns;