import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { Container } from "@components/ui";
import { PiSignOutThin, PiPencilThin, PiCheckThin, PiXThin, PiCameraThin, PiWalletThin, PiCalendarThin, PiCheckCircleThin, PiUserThin, PiTrashThin } from 'react-icons/pi';
import { profileAPI } from "@src/api/modules/profile.js";
import { CheckoutApi } from "@src/api/modules/checkout.js";
import ConfirmModal from "@components/ui/ConfirmModal/ConfirmModal";
import { useLang } from "@hooks/useLang";

const Profile = () => {
    const navigate = useNavigate();
    const { getTranslate } = useLang();
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [userData, setUserData] = useState(null);
    const [editData, setEditData] = useState(null);
    const [orders, setOrders] = useState([]);

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });


    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("authToken");

                if (!token) {
                    navigate("/auth/login");
                    return;
                }
                const profileData = await profileAPI.getProfile();

                const userInfo = {
                    firstName: profileData.data.first_name || "",
                    lastName: profileData.data.last_name || "",
                    email: profileData.data.email || "",
                    phone: profileData.data.phone || "",
                    address: profileData.data.address || "",
                    city: profileData.data.city || "",
                    state: profileData.data.state || "",
                    postalCode: profileData.data.postal_code || "",
                    country: profileData.data.country || "",
                    nationality: profileData.data.nationality || "",
                    passportNumber: profileData.data.passport_number || "",
                    emergencyContactName: profileData.data.emergency_contact_name || "",
                    emergencyContactPhone: profileData.data.emergency_contact_phone || "",
                    preferredLanguage: profileData.data.preferred_language || "en",
                    receiveNewsletter: profileData.data.receive_newsletter ?? true,
                    receiveBookingNotifications: profileData.data.receive_booking_notifications ?? true,
                    avatar: profileData.data.avatar || "",
                    dateOfBirth: profileData.data.date_of_birth || "",
                    gender: profileData.data.gender || ""
                };

                setUserData(userInfo);
                setEditData(userInfo);

                const ordersData = await CheckoutApi.getOrders();
                
                const formattedOrders = ordersData.map(order => ({
                    id: order.id,
                    orderId: order.order_number,
                    orderNumber: order.order_number,
                    checkIn: order.items?.[0]?.check_in || '',
                    checkInTime: "15:00",
                    checkOut: order.items?.[0]?.check_out || '',
                    checkOutTime: "11:00",
                    roomType: order.items?.[0]?.room_title || 'Room',
                    roomNumber: order.id,
                    total: parseFloat(order.final_amount || 0),
                    status: order.status,
                    bookingStatus: getBookingStatus(order.status),
                    canExtend: order.items?.[0]?.check_out ? canExtendStay(order.items[0].check_out) : false,
                    nights: order.items?.[0]?.nights || 0,
                    adults: order.items?.[0]?.adults || 0,
                    children: order.items?.[0]?.children || 0
                }));
                setOrders(formattedOrders);

                setError(null);
            } catch (err) {
                setError(err.message || getTranslate("profile", "failedToUpdate"));
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [navigate, getTranslate]);

    const getBookingStatus = useCallback((status) => {
        const statusMap = {
            "pending": getTranslate("profile", "bookingStatus", "pending"),
            "confirmed": getTranslate("profile", "bookingStatus", "confirmed"),
            "checked_in": getTranslate("profile", "bookingStatus", "checkedIn"),
            "checked_out": getTranslate("profile", "bookingStatus", "checkedOut"),
            "cancelled": getTranslate("profile", "bookingStatus", "cancelled"),
            "rejected": getTranslate("profile", "bookingStatus", "rejected"),
            "abort": getTranslate("profile", "bookingStatus", "aborted")
        };
        return statusMap[status] || status;
    }, [getTranslate]);

    const canExtendStay = useCallback((checkOutDate) => {
        const checkOut = new Date(checkOutDate);
        const today = new Date();
        return checkOut > today;
    }, []);

    const calculateStats = useMemo(() => {
        if (!orders.length) return { totalOrders: 0, totalSpent: 0, completed: 0 };

        return {
            totalOrders: orders.length,
            totalSpent: orders.reduce((sum, order) => sum + (order.total || 0), 0),
            completed: orders.filter(o => o.status === "confirmed").length
        };
    }, [orders]);

    const handleEditToggle = () => {
        setIsEditMode(!isEditMode);
        if (isEditMode) {
            setEditData(userData);
        }
    };

    const handleSaveProfile = async () => {
        try {
            await profileAPI.updateProfile({
                first_name: editData.firstName,
                last_name: editData.lastName,
                email: editData.email,
                phone: editData.phone,
                address: editData.address,
                city: editData.city,
                state: editData.state,
                postal_code: editData.postalCode,
                country: editData.country,
                nationality: editData.nationality,
                passport_number: editData.passportNumber,
                emergency_contact_name: editData.emergencyContactName,
                emergency_contact_phone: editData.emergencyContactPhone,
                preferred_language: editData.preferredLanguage,
                receive_newsletter: editData.receiveNewsletter,
                receive_booking_notifications: editData.receiveBookingNotifications
            });

            setUserData(editData);
            setIsEditMode(false);
            alert(getTranslate("profile", "profileUpdated"));
        } catch (err) {
            alert(getTranslate("profile", "failedToUpdate"));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSavePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert(getTranslate("profile", "passwordsNotMatch"));
            return;
        }

        try {
            await profileAPI.changePassword(
                passwordData.currentPassword,
                passwordData.newPassword
            );
            alert(getTranslate("profile", "passwordChanged"));
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (err) {
            alert(getTranslate("profile", "failedToChangePassword"));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/auth/login");
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const data = await profileAPI.uploadAvatar(file);
                setEditData(prev => ({
                    ...prev,
                    avatar: data.data.avatar
                }));
                setUserData(prev => ({
                    ...prev,
                    avatar: data.data.avatar
                }));
            } catch (err) {
                alert(getTranslate("profile", "failedToUpload"));
            }
        }
    };

    const handleDeleteAvatar = async () => {
        try {
            await profileAPI.deleteAvatar();
            setEditData(prev => ({
                ...prev,
                avatar: ""
            }));
            setUserData(prev => ({
                ...prev,
                avatar: ""
            }));
        } catch (err) {
            alert(getTranslate("profile", "failedToDelete"));
        }
    };

    const handleExtendStay = async (orderNumber) => {
        navigate(`/order-success?order=${orderNumber}`);
    };

    return (
        <section className="profile">
            <Container>
                <div className="profile__wrapper">
                    {loading ? (
                        <div className="profile__loading">
                            <p>{getTranslate("profile", "loadingProfile")}</p>
                        </div>
                    ) : error ? (
                        <div className="profile__error">
                            <p>{getTranslate("messages", "error")}: {error}</p>
                            <button onClick={() => window.location.reload()}>{getTranslate("errors", "tryAgain")}</button>
                        </div>
                    ) : userData ? (
                        <>

                            <div className="profile__header">
                                <div className="profile__header-left">
                                    <div className="profile__avatar-wrapper">
                                        <div className="profile__avatar-container">
                                            {userData.avatar ? (
                                                <img src={userData.avatar} alt="User Avatar" className="profile__avatar" />
                                            ) : (
                                                <div className="profile__avatar-placeholder">
                                                    <PiUserThin className="profile__avatar-placeholder-icon" />
                                                </div>
                                            )}
                                            <label className="profile__avatar-upload">
                                                <PiCameraThin className="profile__avatar-icon" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                        </div>
                                        {userData.avatar && (
                                            <button
                                                className="profile__avatar-delete-btn"
                                                onClick={() => setShowDeleteModal(true)}
                                                title={getTranslate("profile", "removePhoto")}
                                            >
                                                <PiTrashThin className="profile__avatar-delete-btn-icon" />
                                                <span>{getTranslate("profile", "removePhoto")}</span>
                                            </button>
                                        )}
                                    </div>
                                    <div className="profile__header-content">
                                        <h1 className="profile__title">{userData.firstName} {userData.lastName}</h1>
                                        <p className="profile__subtitle">{getTranslate("profile", "memberSince")} {new Date().getFullYear()}</p>
                                        <div className="profile__loyalty">
                                            <span className="profile__loyalty-label">{getTranslate("profile", "email")}:</span>
                                            <span className="profile__loyalty-value">{userData.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="profile__logout-btn" onClick={handleLogout}>
                                    <PiSignOutThin className="profile__logout-icon" />
                                    <span>{getTranslate("profile", "logout")}</span>
                                </button>
                            </div>

                            <div className="profile__stats">
                                <div className="profile__stat-card">
                                    <div className="profile__stat-number">{calculateStats.totalOrders}</div>
                                    <div className="profile__stat-label">{getTranslate("profile", "totalOrders")}</div>
                                </div>
                                <div className="profile__stat-card">
                                    <div className="profile__stat-number">${calculateStats.totalSpent.toFixed(2)}</div>
                                    <div className="profile__stat-label">{getTranslate("profile", "totalSpent")}</div>
                                </div>
                                <div className="profile__stat-card">
                                    <PiWalletThin className="profile__stat-icon" />
                                    <div className="profile__stat-number">$0.00</div>
                                    <div className="profile__stat-label">{getTranslate("profile", "accountBalance")}</div>
                                </div>
                                <div className="profile__stat-card">
                                    <div className="profile__stat-number">{calculateStats.completed}</div>
                                    <div className="profile__stat-label">{getTranslate("profile", "completed")}</div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="profile__tabs">
                                <button
                                    className={`profile__tab ${activeTab === "overview" ? "active" : ""}`}
                                    onClick={() => setActiveTab("overview")}
                                >
                                    {getTranslate("profile", "overview")}
                                </button>
                                <button
                                    className={`profile__tab ${activeTab === "orders" ? "active" : ""}`}
                                    onClick={() => setActiveTab("orders")}
                                >
                                    {getTranslate("profile", "orders")}
                                </button>
                                <button
                                    className={`profile__tab ${activeTab === "settings" ? "active" : ""}`}
                                    onClick={() => setActiveTab("settings")}
                                >
                                    {getTranslate("profile", "settings")}
                                </button>
                            </div>

                            <div className="profile__content">

                                {activeTab === "overview" && (
                                    <div className="profile__overview">
                                        <div className="profile__section">
                                            <div className="profile__section-header">
                                                <h2 className="profile__section-title">{getTranslate("profile", "personalInformation")}</h2>
                                                <button
                                                    className="profile__edit-btn"
                                                    onClick={handleEditToggle}
                                                >
                                                    <PiPencilThin />
                                                    {isEditMode ? getTranslate("profile", "cancel") : getTranslate("profile", "edit")}
                                                </button>
                                            </div>

                                            {isEditMode ? (
                                                <div className="profile__form">
                                                    <div className="profile__form-row">
                                                        <div className="profile__form-group">
                                                            <label className="profile__form-label">{getTranslate("profile", "firstName")}</label>
                                                            <input
                                                                type="text"
                                                                name="firstName"
                                                                value={editData.firstName}
                                                                onChange={handleInputChange}
                                                                className="profile__form-input"
                                                            />
                                                        </div>
                                                        <div className="profile__form-group">
                                                            <label className="profile__form-label">{getTranslate("profile", "lastName")}</label>
                                                            <input
                                                                type="text"
                                                                name="lastName"
                                                                value={editData.lastName}
                                                                onChange={handleInputChange}
                                                                className="profile__form-input"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="profile__form-group">
                                                        <label className="profile__form-label">{getTranslate("profile", "email")}</label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={editData.email}
                                                            onChange={handleInputChange}
                                                            className="profile__form-input"
                                                        />
                                                    </div>

                                                    <div className="profile__form-group">
                                                        <label className="profile__form-label">{getTranslate("profile", "phone")}</label>
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={editData.phone}
                                                            onChange={handleInputChange}
                                                            className="profile__form-input"
                                                        />
                                                    </div>

                                                    <div className="profile__form-group">
                                                        <label className="profile__form-label">{getTranslate("profile", "address")}</label>
                                                        <input
                                                            type="text"
                                                            name="address"
                                                            value={editData.address}
                                                            onChange={handleInputChange}
                                                            className="profile__form-input"
                                                        />
                                                    </div>

                                                    <div className="profile__form-row">
                                                        <div className="profile__form-group">
                                                            <label className="profile__form-label">{getTranslate("profile", "city")}</label>
                                                            <input
                                                                type="text"
                                                                name="city"
                                                                value={editData.city}
                                                                onChange={handleInputChange}
                                                                className="profile__form-input"
                                                                placeholder={getTranslate("profile", "notProvided")}
                                                            />
                                                        </div>
                                                        <div className="profile__form-group">
                                                            <label className="profile__form-label">{getTranslate("profile", "state")}</label>
                                                            <input
                                                                type="text"
                                                                name="state"
                                                                value={editData.state}
                                                                onChange={handleInputChange}
                                                                className="profile__form-input"
                                                                placeholder={getTranslate("profile", "notProvided")}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="profile__form-row">
                                                        <div className="profile__form-group">
                                                            <label className="profile__form-label">{getTranslate("profile", "postalCode")}</label>
                                                            <input
                                                                type="text"
                                                                name="postalCode"
                                                                value={editData.postalCode}
                                                                onChange={handleInputChange}
                                                                className="profile__form-input"
                                                                placeholder={getTranslate("profile", "notProvided")}
                                                            />
                                                        </div>
                                                        <div className="profile__form-group">
                                                            <label className="profile__form-label">{getTranslate("profile", "country")}</label>
                                                            <input
                                                                type="text"
                                                                name="country"
                                                                value={editData.country}
                                                                onChange={handleInputChange}
                                                                className="profile__form-input"
                                                                placeholder={getTranslate("profile", "notProvided")}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="profile__form-row">
                                                        <div className="profile__form-group">
                                                            <label className="profile__form-label">{getTranslate("profile", "nationality")}</label>
                                                            <input
                                                                type="text"
                                                                name="nationality"
                                                                value={editData.nationality}
                                                                onChange={handleInputChange}
                                                                className="profile__form-input"
                                                                placeholder={getTranslate("profile", "notProvided")}
                                                            />
                                                        </div>
                                                        <div className="profile__form-group">
                                                            <label className="profile__form-label">{getTranslate("profile", "passportNumber")}</label>
                                                            <input
                                                                type="text"
                                                                name="passportNumber"
                                                                value={editData.passportNumber}
                                                                onChange={handleInputChange}
                                                                className="profile__form-input"
                                                                placeholder={getTranslate("profile", "notProvided")}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="profile__form-row">
                                                        <div className="profile__form-group">
                                                            <label className="profile__form-label">{getTranslate("profile", "emergencyContactName")}</label>
                                                            <input
                                                                type="text"
                                                                name="emergencyContactName"
                                                                value={editData.emergencyContactName}
                                                                onChange={handleInputChange}
                                                                className="profile__form-input"
                                                                placeholder={getTranslate("profile", "notProvided")}
                                                            />
                                                        </div>
                                                        <div className="profile__form-group">
                                                            <label className="profile__form-label">{getTranslate("profile", "emergencyContactPhone")}</label>
                                                            <input
                                                                type="tel"
                                                                name="emergencyContactPhone"
                                                                value={editData.emergencyContactPhone}
                                                                onChange={handleInputChange}
                                                                className="profile__form-input"
                                                                placeholder={getTranslate("profile", "notProvided")}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="profile__form-group">
                                                        <label className="profile__form-label">{getTranslate("profile", "preferredLanguage")}</label>
                                                        <select
                                                            name="preferredLanguage"
                                                            value={editData.preferredLanguage}
                                                            onChange={handleInputChange}
                                                            className="profile__form-input"
                                                        >
                                                            <option value="en">English</option>
                                                            <option value="az">Azərbaycan</option>
                                                            <option value="ru">Русский</option>
                                                        </select>
                                                    </div>

                                                    <div className="profile__form-group">
                                                        <label className="profile__form-checkbox">
                                                            <input
                                                                type="checkbox"
                                                                name="receiveNewsletter"
                                                                checked={editData.receiveNewsletter}
                                                                onChange={(e) => setEditData(prev => ({ ...prev, receiveNewsletter: e.target.checked }))}
                                                            />
                                                            <span>{getTranslate("profile", "receiveNewsletter")}</span>
                                                        </label>
                                                    </div>

                                                    <div className="profile__form-group">
                                                        <label className="profile__form-checkbox">
                                                            <input
                                                                type="checkbox"
                                                                name="receiveBookingNotifications"
                                                                checked={editData.receiveBookingNotifications}
                                                                onChange={(e) => setEditData(prev => ({ ...prev, receiveBookingNotifications: e.target.checked }))}
                                                            />
                                                            <span>{getTranslate("profile", "receiveBookingNotifications")}</span>
                                                        </label>
                                                    </div>

                                                    <div className="profile__form-actions">
                                                        <button
                                                            className="profile__save-btn"
                                                            onClick={handleSaveProfile}
                                                        >
                                                            <PiCheckThin />
                                                            {getTranslate("profile", "saveChanges")}
                                                        </button>
                                                        <button
                                                            className="profile__cancel-btn"
                                                            onClick={handleEditToggle}
                                                        >
                                                            <PiXThin />
                                                            {getTranslate("profile", "cancel")}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="profile__info-grid">
                                                    <div className="profile__info-item">
                                                        <span className="profile__info-label">{getTranslate("profile", "firstName")}</span>
                                                        <span className="profile__info-value">{userData.firstName}</span>
                                                    </div>
                                                    <div className="profile__info-item">
                                                        <span className="profile__info-label">{getTranslate("profile", "lastName")}</span>
                                                        <span className="profile__info-value">{userData.lastName}</span>
                                                    </div>
                                                    <div className="profile__info-item">
                                                        <span className="profile__info-label">{getTranslate("profile", "email")}</span>
                                                        <span className="profile__info-value">{userData.email}</span>
                                                    </div>
                                                    <div className="profile__info-item">
                                                        <span className="profile__info-label">{getTranslate("profile", "phone")}</span>
                                                        <span className="profile__info-value">{userData.phone || getTranslate("profile", "notProvided")}</span>
                                                    </div>
                                                    <div className="profile__info-item">
                                                        <span className="profile__info-label">{getTranslate("profile", "address")}</span>
                                                        <span className="profile__info-value">{userData.address || getTranslate("profile", "notProvided")}</span>
                                                    </div>
                                                    <div className="profile__info-item">
                                                        <span className="profile__info-label">{getTranslate("profile", "city")}</span>
                                                        <span className="profile__info-value">{userData.city || getTranslate("profile", "notProvided")}</span>
                                                    </div>
                                                    <div className="profile__info-item">
                                                        <span className="profile__info-label">{getTranslate("profile", "state")}</span>
                                                        <span className="profile__info-value">{userData.state || getTranslate("profile", "notProvided")}</span>
                                                    </div>
                                                    <div className="profile__info-item">
                                                        <span className="profile__info-label">{getTranslate("profile", "postalCode")}</span>
                                                        <span className="profile__info-value">{userData.postalCode || getTranslate("profile", "notProvided")}</span>
                                                    </div>
                                                    <div className="profile__info-item">
                                                        <span className="profile__info-label">{getTranslate("profile", "country")}</span>
                                                        <span className="profile__info-value">{userData.country || getTranslate("profile", "notProvided")}</span>
                                                    </div>
                                                    <div className="profile__info-item">
                                                        <span className="profile__info-label">{getTranslate("profile", "nationality")}</span>
                                                        <span className="profile__info-value">{userData.nationality || getTranslate("profile", "notProvided")}</span>
                                                    </div>
                                                    <div className="profile__info-item">
                                                        <span className="profile__info-label">{getTranslate("profile", "passportNumber")}</span>
                                                        <span className="profile__info-value">{userData.passportNumber || getTranslate("profile", "notProvided")}</span>
                                                    </div>
                                                    <div className="profile__info-item">
                                                        <span className="profile__info-label">{getTranslate("profile", "emergencyContactName")}</span>
                                                        <span className="profile__info-value">{userData.emergencyContactName || getTranslate("profile", "notProvided")}</span>
                                                    </div>
                                                    <div className="profile__info-item">
                                                        <span className="profile__info-label">{getTranslate("profile", "emergencyContactPhone")}</span>
                                                        <span className="profile__info-value">{userData.emergencyContactPhone || getTranslate("profile", "notProvided")}</span>
                                                    </div>
                                                    <div className="profile__info-item">
                                                        <span className="profile__info-label">{getTranslate("profile", "preferredLanguage")}</span>
                                                        <span className="profile__info-value">
                                                            {userData.preferredLanguage === 'en' ? 'English' : 
                                                             userData.preferredLanguage === 'az' ? 'Azərbaycan' : 
                                                             userData.preferredLanguage === 'ru' ? 'Русский' : 
                                                             getTranslate("profile", "notProvided")}
                                                        </span>
                                                    </div>
                                                    <div className="profile__info-item">
                                                        <span className="profile__info-label">{getTranslate("profile", "receiveNewsletter")}</span>
                                                        <span className="profile__info-value">{userData.receiveNewsletter ? getTranslate("common", "yes") : getTranslate("common", "no")}</span>
                                                    </div>
                                                    <div className="profile__info-item">
                                                        <span className="profile__info-label">{getTranslate("profile", "receiveBookingNotifications")}</span>
                                                        <span className="profile__info-value">{userData.receiveBookingNotifications ? getTranslate("common", "yes") : getTranslate("common", "no")}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Orders Tab */}
                                {activeTab === "orders" && (
                                    <div className="profile__orders">
                                        <div className="profile__section">
                                            <h2 className="profile__section-title">{getTranslate("profile", "orderHistory")}</h2>
                                            <div className="profile__orders-list">
                                                {orders.map((order) => (
                                                    <div key={order.id} className="profile__order-card">
                                                        <div className="profile__order-header">
                                                            <div className="profile__order-id-section">
                                                                <div className="profile__order-id">{order.orderId}</div>
                                                                <div className="profile__order-room-number">Room {order.roomNumber}</div>
                                                            </div>
                                                            <div className="profile__order-status-section">
                                                                <div className={`profile__order-status ${order.status.toLowerCase()}`}>
                                                                    <PiCheckCircleThin className="profile__order-status-icon" />
                                                                    Completed
                                                                </div>
                                                                <div className={`profile__booking-status ${order.bookingStatus.toLowerCase().replace(' ', '-')}`}>
                                                                    {order.bookingStatus}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="profile__order-room-type">
                                                            {order.roomType}
                                                        </div>

                                                        <div className="profile__order-details">
                                                            <div className="profile__order-item">
                                                                <span className="profile__order-label">
                                                                    <PiCalendarThin className="profile__order-label-icon" />
                                                                    {getTranslate("profile", "checkIn")}
                                                                </span>
                                                                <span className="profile__order-value">
                                                                    {order.checkIn} <span className="profile__order-time">{getTranslate("profile", "at")} {order.checkInTime}</span>
                                                                </span>
                                                            </div>
                                                            <div className="profile__order-item">
                                                                <span className="profile__order-label">
                                                                    <PiCalendarThin className="profile__order-label-icon" />
                                                                    {getTranslate("profile", "checkOut")}
                                                                </span>
                                                                <span className="profile__order-value">
                                                                    {order.checkOut} <span className="profile__order-time">{getTranslate("profile", "at")} {order.checkOutTime}</span>
                                                                </span>
                                                            </div>
                                                            <div className="profile__order-item">
                                                                <span className="profile__order-label">{getTranslate("profile", "amountPaid")}</span>
                                                                <span className="profile__order-value profile__order-total">${order.total.toFixed(2)}</span>
                                                            </div>
                                                        </div>

                                                        {order.canExtend && (
                                                            <button
                                                                className="profile__extend-btn"
                                                                onClick={() => handleExtendStay(order.orderNumber || order.orderId)}
                                                            >
                                                                {getTranslate("profile", "extendStay")}
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Settings Tab */}
                                {activeTab === "settings" && (
                                    <div className="profile__settings">
                                        <div className="profile__section">
                                            <h2 className="profile__section-title">{getTranslate("profile", "changePassword")}</h2>
                                            <div className="profile__form">
                                                <div className="profile__form-group">
                                                    <label className="profile__form-label">{getTranslate("profile", "currentPassword")}</label>
                                                    <input
                                                        type="password"
                                                        name="currentPassword"
                                                        value={passwordData.currentPassword}
                                                        onChange={handlePasswordChange}
                                                        className="profile__form-input"
                                                        placeholder={getTranslate("profile", "enterCurrentPassword")}
                                                    />
                                                </div>

                                                <div className="profile__form-group">
                                                    <label className="profile__form-label">{getTranslate("profile", "newPassword")}</label>
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        value={passwordData.newPassword}
                                                        onChange={handlePasswordChange}
                                                        className="profile__form-input"
                                                        placeholder={getTranslate("profile", "enterNewPassword")}
                                                    />
                                                </div>

                                                <div className="profile__form-group">
                                                    <label className="profile__form-label">{getTranslate("profile", "confirmPassword")}</label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={passwordData.confirmPassword}
                                                        onChange={handlePasswordChange}
                                                        className="profile__form-input"
                                                        placeholder={getTranslate("profile", "confirmNewPassword")}
                                                    />
                                                </div>

                                                <button
                                                    className="profile__save-btn"
                                                    onClick={handleSavePassword}
                                                >
                                                    {getTranslate("profile", "updatePassword")}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : null}
                </div>
            </Container>

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAvatar}
                title={getTranslate("profile", "removeProfilePicture")}
                message={getTranslate("profile", "confirmRemoveAvatar")}
                confirmText={getTranslate("profile", "remove")}
                cancelText={getTranslate("common", "cancel")}
                type="danger"
            />
        </section>
    );
};

export default Profile;
