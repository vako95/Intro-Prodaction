import "./FormSubmit.css";
import { HoverButton } from "@components/ui";

const FormSubmit = () => {

    return (
        <div className="hotel-booking__form-submit">
            <HoverButton color="gold" size="sm">
                Check Availability
            </HoverButton>
        </div>
    )
}

export default FormSubmit;