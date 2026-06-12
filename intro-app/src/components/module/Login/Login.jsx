import { Formik, Form, Field } from "formik";
import { HoverButton, HoverLink } from "@components/ui";
import { MdAlternateEmail } from "react-icons/md";
import { SiAuthelia } from "react-icons/si";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "@src/api";
import { useLang } from "@hooks/useLang";

import "./Login.css";
import Input from "../../ui/Input/Input";

const Login = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { getTranslate } = useLang();

    const handleLogin = async (values) => {
        try {
            setLoading(true);
            setError("");

            const response = await loginAPI.login(values.login_email, values.login_password);
            
          
            if (response?.data?.user) {
                setTimeout(() => {
                    navigate("/profile", { replace: true });
                }, 100);
            } else {
                setError(getTranslate("auth", "loginPage", "noUserData"));
            }
        } catch (err) {
            let errorMessage = getTranslate("auth", "loginPage", "loginFailed");
            if (err.response?.data?.detail) {
                errorMessage = err.response.data.detail;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <article className="login">
            <div className="login__heading">
                <h1 className="login__heading-title">
                    {getTranslate("auth", "loginPage", "title")}
                </h1>
            </div>
            <Formik
                initialValues={{
                    login_email: "",
                    login_password: "",
                }}
                onSubmit={handleLogin}
            >
                {({ values, handleChange, handleBlur }) => (
                    <Form className="login__form" action="">
                        <div className="login__form-content">
                            {error && (
                                <div className="login__form-error" style={{
                                    color: "red",
                                    marginBottom: "15px",
                                    padding: "10px",
                                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                                    borderRadius: "4px"
                                }}>
                                    {error}
                                </div>
                            )}
                            <div className="login__form-field">
                                <Input
                                    icon={<MdAlternateEmail />}
                                    inputProps={{
                                        name: "login_email",
                                        value: values.login_email,
                                        onChange: handleChange,
                                        onBlur: handleBlur,
                                    }}
                                    type="text"
                                    showPassword={true}
                                    position="left"
                                    placeholder={getTranslate("auth", "loginPage", "emailPlaceholder")}
                                />
                            </div>
                            <div className="login__form-field">
                                <Input
                                    inputProps={{
                                        name: "login_password",
                                        value: values.login_password,
                                        onChange: handleChange,
                                        onBlur: handleBlur,
                                    }}
                                    icon={<SiAuthelia />}
                                    position="left"
                                    type="password"
                                    placeholder={getTranslate("auth", "loginPage", "passwordPlaceholder")}
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
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? getTranslate("auth", "loginPage", "loggingIn") : getTranslate("auth", "loginPage", "loginButton")}
                            </HoverButton>
                        </div>
                        <div className="login__form-meta-action">
                            <HoverLink
                                hoverBgColor="transparent"
                                variant="invisible"
                                to="/auth/reset"
                            >
                                {getTranslate("auth", "loginPage", "forgotPassword")}
                            </HoverLink>
                        </div>
                    </Form>
                )}
            </Formik>
        </article >

    )
}

export default Login;