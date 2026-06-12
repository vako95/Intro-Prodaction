import { Input, HoverButton } from "@components/ui"

import { MdAlternateEmail } from "react-icons/md";
import { Form, Formik } from "formik";
import { useLang } from "@hooks/useLang";

import "./ResetPasswordConfirm.css";

const ResetPasswordConfirm = () => {
    const { getTranslate } = useLang();

    return (
        <div className="reset-password-confirm">
            <div className="reset-password-confirm__heading">
                <h1 className="reset-password-confirm__heading-title">
                    {getTranslate("auth", "resetPassword", "confirmTitle")}
                </h1>
            </div>
            <Formik
                initialValues={{
                    reset_email: "",
                    reset_password: "",
                }}
                onSubmit={() => {}}
            >
                <Form className="reset-password-confirm__form" action="">
                    <div className="reset-password-confirm__form-content">
                        <div class="reset-password-confirm__form-field">
                            <Input
                                icon={<MdAlternateEmail />}
                                inputProps={{
                                    name: "reset-password-confirm_email",
                                }}
                                type="password"
                                showPassword={false}
                                position="left"
                                placeholder={getTranslate("common", "email")}
                            />
                        </div>
                    </div>
                    <div className="login__form-control">
                        <HoverButton
                            width="100%"
                            variant="simple"
                            bgColor="rgba(0, 173, 69)"
                            hoverBgColor="rgba(31, 132, 71)"
                            hoverTextColor="#000"
                            size="md"
                        >
                            {getTranslate("common", "submit")}
                        </HoverButton>
                    </div>
                </Form>
            </Formik>
        </div>
    )
}

export default ResetPasswordConfirm;