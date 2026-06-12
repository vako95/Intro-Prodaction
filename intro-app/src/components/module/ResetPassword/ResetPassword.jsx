import { Input, HoverButton } from "@components/ui"
import "./ResetPassword.css";
import { MdAlternateEmail, MdLockOutline } from "react-icons/md";
import { Form, Formik } from "formik";
import { useState } from "react";
import { passwordAPI } from "@src/api";
import { useNavigate } from "react-router-dom";
import { useLang } from "@hooks/useLang";
import * as Yup from "yup";

const ResetPassword = () => {
    const [step, setStep] = useState(1); // 1: email, 2: pin, 3: new password
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const { getTranslate } = useLang();

    const emailSchema = Yup.object({
        email: Yup.string().email(getTranslate("errors", "invalidEmail")).required(getTranslate("errors", "requiredField")),
    });

    const pinSchema = Yup.object({
        pin: Yup.string().required(getTranslate("errors", "pinRequired")).length(6, getTranslate("errors", "pinLength")),
    });

    const passwordSchema = Yup.object({
        new_password: Yup.string()
            .min(8, getTranslate("errors", "passwordTooShort"))
            .required(getTranslate("errors", "requiredField")),
        confirm_password: Yup.string()
            .oneOf([Yup.ref("new_password")], getTranslate("errors", "passwordsNotMatch"))
            .required(getTranslate("errors", "requiredField")),
    });

    const handleEmailSubmit = async (values) => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await passwordAPI.requestReset(values.email);
            setEmail(values.email);
            setSuccess(getTranslate("auth", "resetPassword", "pinSent"));
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.detail || getTranslate("auth", "resetPassword", "failedToSend"));
        } finally {
            setLoading(false);
        }
    };

    const handlePinSubmit = async (values) => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const response = await passwordAPI.confirmReset(email, values.pin);
            setToken(response.data.token);
            setSuccess(getTranslate("auth", "resetPassword", "pinVerified"));
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.detail || getTranslate("auth", "resetPassword", "invalidPin"));
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (values) => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await passwordAPI.changePassword(email, token, values.new_password);
            setSuccess(getTranslate("auth", "resetPassword", "passwordReset"));
            setTimeout(() => {
                navigate("/auth/login");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.detail || getTranslate("auth", "resetPassword", "failedToReset"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password">
            <div className="reset-password__heading">
                <h1 className="reset-password__heading-title">
                    {getTranslate("auth", "resetPassword", "title")}
                </h1>
                <p className="reset-password__heading-subtitle">
                    {step === 1 && getTranslate("auth", "resetPassword", "emailStep")}
                    {step === 2 && getTranslate("auth", "resetPassword", "pinStep")}
                    {step === 3 && getTranslate("auth", "resetPassword", "passwordStep")}
                </p>
            </div>

            {error && <div className="reset-password__error">{error}</div>}
            {success && <div className="reset-password__success">{success}</div>}

            {step === 1 && (
                <Formik
                    initialValues={{ email: "" }}
                    validationSchema={emailSchema}
                    onSubmit={handleEmailSubmit}
                >
                    {({ errors, touched, values, handleChange, handleBlur }) => (
                        <Form className="reset-password__form">
                            <div className="reset-password__form-content">
                                <div className="reset-password__form-field">
                                    <Input
                                        icon={<MdAlternateEmail />}
                                        inputProps={{
                                            name: "email",
                                            value: values.email,
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                        }}
                                        type="email"
                                        position="left"
                                        placeholder={getTranslate("auth", "resetPassword", "emailPlaceholder")}
                                    />
                                    {errors.email && touched.email && (
                                        <div className="reset-password__form-error">{errors.email}</div>
                                    )}
                                </div>
                            </div>
                            <div className="reset-password__form-control">
                                <HoverButton
                                    width="100%"
                                    variant="simple"
                                    bgColor="rgba(0, 173, 69)"
                                    hoverBgColor="rgba(31, 132, 71)"
                                    hoverTextColor="#000"
                                    size="md"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? getTranslate("auth", "resetPassword", "sending") : getTranslate("auth", "resetPassword", "sendButton")}
                                </HoverButton>
                            </div>
                        </Form>
                    )}
                </Formik>
            )}

            {step === 2 && (
                <Formik
                    initialValues={{ pin: "" }}
                    validationSchema={pinSchema}
                    onSubmit={handlePinSubmit}
                >
                    {({ errors, touched, values, handleChange, handleBlur }) => (
                        <Form className="reset-password__form">
                            <div className="reset-password__form-content">
                                <div className="reset-password__form-field">
                                    <Input
                                        icon={<MdLockOutline />}
                                        inputProps={{
                                            name: "pin",
                                            value: values.pin,
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                            maxLength: 6,
                                        }}
                                        type="text"
                                        position="left"
                                        placeholder={getTranslate("auth", "resetPassword", "pinPlaceholder")}
                                    />
                                    {errors.pin && touched.pin && (
                                        <div className="reset-password__form-error">{errors.pin}</div>
                                    )}
                                </div>
                            </div>
                            <div className="reset-password__form-control">
                                <HoverButton
                                    width="100%"
                                    variant="simple"
                                    bgColor="rgba(0, 173, 69)"
                                    hoverBgColor="rgba(31, 132, 71)"
                                    hoverTextColor="#000"
                                    size="md"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? getTranslate("auth", "resetPassword", "verifying") : getTranslate("auth", "resetPassword", "verifyButton")}
                                </HoverButton>
                            </div>
                        </Form>
                    )}
                </Formik>
            )}

            {step === 3 && (
                <Formik
                    initialValues={{ new_password: "", confirm_password: "" }}
                    validationSchema={passwordSchema}
                    onSubmit={handlePasswordSubmit}
                >
                    {({ errors, touched, values, handleChange, handleBlur }) => (
                        <Form className="reset-password__form">
                            <div className="reset-password__form-content">
                                <div className="reset-password__form-field">
                                    <Input
                                        icon={<MdLockOutline />}
                                        inputProps={{
                                            name: "new_password",
                                            value: values.new_password,
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                        }}
                                        type="password"
                                        showPassword={true}
                                        position="left"
                                        placeholder={getTranslate("auth", "resetPassword", "newPasswordPlaceholder")}
                                    />
                                    {errors.new_password && touched.new_password && (
                                        <div className="reset-password__form-error">{errors.new_password}</div>
                                    )}
                                </div>
                                <div className="reset-password__form-field">
                                    <Input
                                        icon={<MdLockOutline />}
                                        inputProps={{
                                            name: "confirm_password",
                                            value: values.confirm_password,
                                            onChange: handleChange,
                                            onBlur: handleBlur,
                                        }}
                                        type="password"
                                        showPassword={true}
                                        position="left"
                                        placeholder={getTranslate("auth", "resetPassword", "confirmPasswordPlaceholder")}
                                    />
                                    {errors.confirm_password && touched.confirm_password && (
                                        <div className="reset-password__form-error">{errors.confirm_password}</div>
                                    )}
                                </div>
                            </div>
                            <div className="reset-password__form-control">
                                <HoverButton
                                    width="100%"
                                    variant="simple"
                                    bgColor="rgba(0, 173, 69)"
                                    hoverBgColor="rgba(31, 132, 71)"
                                    hoverTextColor="#000"
                                    size="md"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? getTranslate("auth", "resetPassword", "resetting") : getTranslate("auth", "resetPassword", "resetButton")}
                                </HoverButton>
                            </div>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

export default ResetPassword;
