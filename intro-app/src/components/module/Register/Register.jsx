import { useState } from "react";
import { HoverButton } from "@components/ui";
import { LuCalendarDays } from "react-icons/lu";
import { IoTodayOutline } from "react-icons/io5";
import { MdAlternateEmail } from "react-icons/md";
import { SiAuthelia } from "react-icons/si";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "@src/api";
import { useLang } from "@hooks/useLang";
import { Select, Input, MonthField } from "@components/ui";
import { PiUserCirclePlusDuotone } from "react-icons/pi";

import "./Register.css";

const Register = () => {
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();
    const { getTranslate } = useLang();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        month: 0,
        day: "",
        year: "",
        gender: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const isStepValid = () => {
        switch (step) {
            case 1:
                return formData.firstName.trim() !== "" && formData.lastName.trim() !== "";
            case 2:
                return formData.month > 0 && formData.day !== "" && formData.year !== "" && formData.gender !== "";
            case 3:
                return formData.email.trim() !== "" && formData.password !== "" && formData.passwordConfirm !== "";
            case 4:
                return verificationCode.trim().length === 6;
            default:
                return false;
        }
    };

    const handleNext = async () => {
        if (step === 3 && isStepValid()) {
            if (formData.password !== formData.passwordConfirm) {
                setError(getTranslate("auth", "register", "passwordsNotMatch"));
                return;
            }
            
            try {
                setLoading(true);
                setError("");
                await registerAPI.sendVerificationEmail(formData.email);
                setEmailSent(true);
                setStep(4);
            } catch (err) {
                setError(err.response?.data?.detail || getTranslate("auth", "register", "emailSendFailed"));
            } finally {
                setLoading(false);
            }
        } else if (step < 3 && isStepValid()) {
            setStep(prev => prev + 1);
            setError("");
        }
    };

    const handlePrev = () => {
        if (step > 1) {
            setStep(prev => prev - 1);
            setError("");
        }
    };

    const handleRegister = async () => {
        try {
            setLoading(true);
            setError("");

            let date_of_birth = null;
            if (formData.year && formData.month && formData.day) {
                const monthNum = String(formData.month).padStart(2, '0');
                const dayNum = String(formData.day).padStart(2, '0');
                date_of_birth = `${formData.year}-${monthNum}-${dayNum}`;
            }

            const genderMap = {
                'M': 'male',
                'F': 'female',
                'O': 'other'
            };

            const response = await registerAPI.register({
                email: formData.email,
                password: formData.password,
                first_name: formData.firstName,
                last_name: formData.lastName,
                username: formData.email.split("@")[0],
                date_of_birth: date_of_birth,
                gender: formData.gender ? genderMap[formData.gender] : 'other',
                verification_code: verificationCode
            });
            
            if (response?.success || response?.access || response?.user) {
                navigate("/profile");
            } else {
                setError(getTranslate("auth", "register", "registrationFailed"));
            }
        } catch (err) {
            let errorMessage = getTranslate("auth", "register", "registrationFailed");
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

    const genders = [
        { label: "M", value: "M" },
        { label: "F", value: "F" },
        { label: "O", value: "O" }
    ];

    return (
        <section className="login">
            <div className="login__heading">
                <h1 className="login__heading-title">
                    {getTranslate("auth", "register", "title")}
                </h1>
            </div>

            <form className="login__form" action="">
                {error && (
                    <div style={{
                        color: "red",
                        marginBottom: "15px",
                        padding: "10px",
                        backgroundColor: "rgba(255, 0, 0, 0.1)",
                        borderRadius: "4px"
                    }}>
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <div className="login__form-content">
                        <div className="login__form-field">
                            <Input
                                icon={<PiUserCirclePlusDuotone />}
                                type="text"
                                name="firstName"
                                position="left"
                                placeholder={getTranslate("auth", "register", "firstNamePlaceholder")}
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            />
                        </div>
                        <div className="login__form-field">
                            <Input
                                icon={<PiUserCirclePlusDuotone />}
                                type="text"
                                name="lastName"
                                position="left"
                                placeholder={getTranslate("auth", "register", "lastNamePlaceholder")}
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (

                    <div className="login__form-field">
                        <div className="login__form-field-action">
                            <MonthField
                                value={formData.month}
                                onChange={(value) => setFormData({...formData, month: value})}
                            />
                            <Input
                                icon={<IoTodayOutline />}
                                position="left"
                                placeholder={getTranslate("auth", "register", "dayPlaceholder")}
                                type="text"
                                value={formData.day}
                                onChange={(e) => setFormData({...formData, day: e.target.value})}
                                inputProps={{
                                    pattern: "^[0-9]+$",
                                    maxLength: 2,
                                    onInput: (e) => {
                                        const cleaned = e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                        const num = Math.min(Math.max(Number(cleaned), 1), 31);
                                        e.target.value = cleaned === "" ? "" : String(num);
                                    }
                                }}
                            />
                            <Input
                                icon={<LuCalendarDays />}
                                position="left"
                                placeholder={getTranslate("auth", "register", "yearPlaceholder")}
                                type="text"
                                value={formData.year}
                                onChange={(e) => setFormData({...formData, year: e.target.value})}
                                inputProps={{
                                    pattern: "^[0-9]+$",
                                    maxLength: 4,
                                    onInput: (e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                    }
                                }}
                            />
                        </div>
                        <div className="login__form-field-action">
                            <Select
                                title={getTranslate("auth", "register", "genderLabel")}
                                item={genders}
                                value={formData.gender}
                                onChange={(value) => setFormData({...formData, gender: value})}
                            />
                        </div>
                    </div>


                )}

                {step === 3 && (
                    <div className="login__form-field">
                        <Input
                            icon={<MdAlternateEmail />}
                            type="email"
                            position="left"
                            placeholder={getTranslate("auth", "register", "emailPlaceholder")}
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <Input
                            icon={<SiAuthelia />}
                            type="password"
                            showPassword={true}
                            position="left"
                            placeholder={getTranslate("auth", "register", "passwordPlaceholder")}
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        <Input
                            icon={<RiLockPasswordLine />}
                            type="password"
                            showPassword={true}
                            position="left"
                            placeholder={getTranslate("auth", "register", "confirmPasswordPlaceholder")}
                            value={formData.passwordConfirm}
                            onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})}
                        />
                    </div>
                )}

                {step === 4 && (
                    <div className="login__form-field">
                        <div style={{marginBottom: "20px", textAlign: "center"}}>
                            <p>{getTranslate("auth", "register", "verificationCodeSent")}</p>
                        </div>
                        <Input
                            icon={<SiAuthelia />}
                            type="text"
                            position="left"
                            placeholder={getTranslate("auth", "register", "verificationCodePlaceholder")}
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            inputProps={{
                                maxLength: 6,
                                pattern: "^[0-9]+$",
                                onInput: (e) => {
                                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                }
                            }}
                        />
                    </div>
                )}


                <div className="login__form-control">
                    <div className="login__form-control-action">
                        <HoverButton
                            type="button"
                            onClick={handlePrev}
                            disabled={step === 1}
                            width="120px"
                            variant="simple"
                            bgColor="rgba(170, 132, 83, 0.8)"
                            hoverBgColor="rgba(170, 132, 83)"
                            hoverTextColor="#fff"
                            size="md"
                        >
                            {getTranslate("auth", "register", "prevButton")}
                        </HoverButton>
                    </div>

                    <div className="login__form-step-indicator">
                        <span className="login__form-step-text">{getTranslate("auth", "register", "stepIndicator")} {step} {getTranslate("auth", "register", "of")} 4</span>
                    </div>

                    <div className="login__form-control-action">
                        {step === 4 ? (
                            <HoverButton
                                type="button"
                                onClick={handleRegister}
                                disabled={loading || !isStepValid()}
                                width="120px"
                                variant="simple"
                                bgColor="rgba(0, 173, 69)"
                                hoverBgColor="rgba(31, 132, 71)"
                                hoverTextColor="#fff"
                                size="md"
                            >
                                {loading ? getTranslate("auth", "register", "registering") : getTranslate("auth", "register", "registerButton")}
                            </HoverButton>
                        ) : step === 3 ? (
                            <HoverButton
                                type="button"
                                onClick={handleNext}
                                disabled={loading || !isStepValid()}
                                width="120px"
                                variant="simple"
                                bgColor="rgba(0, 173, 69)"
                                hoverBgColor="rgba(31, 132, 71)"
                                hoverTextColor="#fff"
                                size="md"
                            >
                                {loading ? getTranslate("auth", "register", "sending") : getTranslate("auth", "register", "sendCode")}
                            </HoverButton>
                        ) : (
                            <HoverButton
                                type="button"
                                onClick={handleNext}
                                disabled={!isStepValid()}
                                width="120px"
                                variant="simple"
                                bgColor="rgba(0, 173, 69)"
                                hoverBgColor="rgba(31, 132, 71)"
                                hoverTextColor="#fff"
                                size="md"
                            >
                                {getTranslate("auth", "register", "nextButton")}
                            </HoverButton>
                        )}
                    </div>
                </div>
            </form>
        </section>
    );
};

export default Register;
