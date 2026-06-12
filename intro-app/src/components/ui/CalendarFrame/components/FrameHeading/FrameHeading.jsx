import "./FrameHeading.css";

const FrameHeading = ({ title, subtitle }) => {

    return (
        <div className="calendar-frame__heading">
            <h4 className="calendar-frame__heading-title">{title}</h4>
            <span className="calendar-frame__heading-subtitle">{subtitle}</span>
        </div>
    )
}

export default FrameHeading;