import clsx from 'clsx';
import { useState, useRef, memo, useCallback } from 'react';
import "./HoverButton.css";

const HoverButton = ({
    className,
    children,
    variant,
    color,
    bgColor,
    hoverBgColor,
    textHoverColor,
    textColor,
    size,
    width,
    disabled,
    borderColor,
    border = false,
    btnSize,
    hoverBgStart,
    hoverBgOver,
    type = 'submit',
    onClick,
    ...props
}) => {
    const [ripples, setRipples] = useState([]);
    const [particles, setParticles] = useState([]);
    const buttonRef = useRef(null);

    const classes = clsx(
        "hover__button",
        variant && `hover__button-variant--${variant}`,
        size && `hover__button--${size}`,
        color && `hover__button--${color}`,
        disabled && `hover__button--disabled`,
        btnSize && `hover__button-size--${btnSize}`,
        border && "hover__button-border",
        className
    );

    const style = {
        ...(bgColor && { '--bg-color': bgColor }),
        ...(hoverBgColor && { '--hover-bg-color': hoverBgColor }),
        ...(hoverBgStart && { '--hover-bgstart-color': hoverBgStart }),
        ...(hoverBgOver && { '--hover-bgover-color': hoverBgOver }),
        ...(textColor && { '--btn-text-color': textColor }),
        ...(textHoverColor && { '--btn-hover-text-color': textHoverColor }),
        ...(width && { '--btn-hover-width': width }),
        ...(borderColor && { borderColor: borderColor })
    };

    const handleMouseMove = useCallback((e) => {
        if (variant !== 'simple' || !buttonRef.current) return;

        requestAnimationFrame(() => {
            const button = buttonRef.current;
            if (!button) return;
            
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 50;

            if (distance < maxDistance) {
                const strength = (maxDistance - distance) / maxDistance;
                const moveX = x * strength * 0.3;
                const moveY = y * strength * 0.3;
                button.style.transition = 'transform 300ms ease-out, box-shadow 800ms cubic-bezier(0.4, 0, 0.2, 1), letter-spacing 800ms cubic-bezier(0.4, 0, 0.2, 1)';
                button.style.transform = `translate(${moveX}px, ${moveY}px) translateY(-4px) scale(1.02)`;
            }
        });
    }, [variant]);

    const handleMouseLeave = useCallback(() => {
        if (buttonRef.current) {
            buttonRef.current.style.transition = 'all 800ms cubic-bezier(0.4, 0, 0.2, 1)';
            buttonRef.current.style.transform = '';
        }
    }, []);

    const createParticles = useCallback((x, y) => {
        const particleCount = 8;
        const newParticles = [];

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 20 + Math.random() * 20;
            
            newParticles.push({
                id: Date.now() + i,
                x,
                y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
            });
        }

        setParticles(prev => [...prev, ...newParticles]);

        setTimeout(() => {
            setParticles(prev => 
                prev.filter(p => !newParticles.find(np => np.id === p.id))
            );
        }, 1800);
    }, []);

    const handleClick = useCallback((e) => {
        if (variant === 'simple') {
            requestAnimationFrame(() => {
                const button = e.currentTarget;
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const newRipple = {
                    x,
                    y,
                    id: Date.now()
                };

                setRipples(prev => [...prev, newRipple]);

                setTimeout(() => {
                    setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
                }, 900);

                createParticles(x, y);
            });
        }

        if (onClick) {
            onClick(e);
        }
    }, [variant, onClick, createParticles]);

    return (
        <button 
            ref={buttonRef}
            className={classes} 
            style={style} 
            type={type} 
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            {...props}
        >
            {children}
            {variant === 'simple' && ripples.map(ripple => (
                <span
                    key={ripple.id}
                    className="ripple"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                    }}
                />
            ))}
            {variant === 'simple' && particles.map(particle => (
                <span
                    key={particle.id}
                    className="particle"
                    style={{
                        left: particle.x,
                        top: particle.y,
                        '--particle-x': `${particle.vx}px`,
                    }}
                />
            ))}
        </button>
    );
};

export default memo(HoverButton);
