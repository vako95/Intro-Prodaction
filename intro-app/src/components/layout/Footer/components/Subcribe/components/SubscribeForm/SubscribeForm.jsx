import "./SubscribeForm.css";
import { useState } from "react";
import { HoverButton } from "@components/ui";
import SubsCribeCheckBox from "../../../../../../ui/SubscribeCheckbox/SubscribeCheckbox";
import { useLang } from "@hooks/useLang";
import { useNewsletterSubscribe } from "@hooks/useNewsletter";

const SubsciribeForm = () => {
    const { getTranslate } = useLang();
    const [email, setEmail] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    
    const { mutate: subscribe, isPending } = useNewsletterSubscribe();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        
        if (!email.trim()) {
            const errorMsg = getTranslate("errors", "invalidEmail");
            setMessage({ 
                type: "error", 
                text: errorMsg
            });
            return;
        }
        
        if (!agreed) {
            const errorMsg = "Please agree to terms and conditions";
            setMessage({ 
                type: "error", 
                text: errorMsg
            });
            return;
        }
        
        subscribe(email, {
            onSuccess: (data) => {
                if (data.success) {
                    setMessage({ 
                        type: "success", 
                        text: data.message || getTranslate("messages", "success")
                    });
                    setEmail("");
                    setAgreed(false);
                } else {
                    setMessage({ 
                        type: "error", 
                        text: data.message || getTranslate("messages", "error")
                    });
                }
            },
            onError: (error) => {
                const errorMessage = error?.response?.data?.message 
                    || error?.response?.data?.errors?.email?.[0]
                    || error?.message
                    || getTranslate("messages", "error");
                    
                setMessage({ 
                    type: "error", 
                    text: errorMessage
                });
            }
        });
    };
    
    return (
        <form className="footer__subscribe-form" onSubmit={handleSubmit}>
            <div className="footer__subscribe-form-group">
                <div className="footer__subscribe-email">
                    <input
                        id="newsletter-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={getTranslate("footer", "enterEmail")}
                        className="footer__subscribe-email-field"
                        disabled={isPending}
                        required
                    />
                    <HoverButton 
                        variant="white" 
                        type="submit" 
                        className="footer__subscribe-email-button"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <i className="ri-loader-4-line ri-spin"></i>
                        ) : (
                            <i className="ri-telegram-2-line"></i>
                        )}
                    </HoverButton>
                </div>
            </div>
            <div className="footer__subscribe-form-group">
                <div className="footer__subscribe-checkbox">
                    <SubsCribeCheckBox 
                        color="gold"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                    >
                        {getTranslate("footer", "agreeTerms")}
                    </SubsCribeCheckBox>
                </div>
            </div>
            {message.text && (
                <div className={`footer__subscribe-message footer__subscribe-message--${message.type}`}>
                    {message.text}
                </div>
            )}
        </form>
    )
}

export default SubsciribeForm;