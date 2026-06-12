import React from 'react';
import './AvatarPlaceholder.css';

const AvatarPlaceholder = ({ name = 'User', size = 'medium', className = '' }) => {
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className={`avatar-placeholder avatar-placeholder--${size} ${className}`}>
            <span className="avatar-placeholder__initials">
                {getInitials(name)}
            </span>
        </div>
    );
};

export default AvatarPlaceholder;
