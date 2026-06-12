import { PiUserThin } from 'react-icons/pi';
import './Avatar.css';

const Avatar = ({ 
    src, 
    alt = 'User', 
    name = '', 
    size = 'md',
    className = '' 
}) => {
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    };

    const sizeClasses = {
        xs: 'avatar--xs',
        sm: 'avatar--sm',
        md: 'avatar--md',
        lg: 'avatar--lg',
        xl: 'avatar--xl'
    };

    return (
        <div className={`avatar ${sizeClasses[size]} ${className}`}>
            {src ? (
                <img 
                    src={src} 
                    alt={alt} 
                    className="avatar__image"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
            ) : null}
            <div 
                className="avatar__placeholder" 
                style={{ display: src ? 'none' : 'flex' }}
            >
                {name ? (
                    <span className="avatar__initials">{getInitials(name)}</span>
                ) : (
                    <PiUserThin className="avatar__icon" />
                )}
            </div>
        </div>
    );
};

export default Avatar;
