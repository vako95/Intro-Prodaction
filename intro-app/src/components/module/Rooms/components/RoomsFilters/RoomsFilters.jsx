import { useState } from "react";
import { FaChevronDown, FaTh, FaList, FaFilter } from "react-icons/fa";
import { useLang } from "@hooks/useLang";
import "./RoomsFilters.css";

const RoomsFilters = ({ 
    viewMode, 
    onViewModeChange, 
    sortBy, 
    onSortChange,
    filters,
    onFiltersChange,
    onApplyFilters,
    onResetFilters
}) => {
    const { getTranslate } = useLang();
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showFiltersPanel, setShowFiltersPanel] = useState(false);

    const sortOptions = [
        { value: "recommended", label: getTranslate("rooms", "recommended") },
        { value: "price_low", label: getTranslate("rooms", "priceLowToHigh") },
        { value: "price_high", label: getTranslate("rooms", "priceHighToLow") },
        { value: "rating", label: getTranslate("rooms", "highestRated") },
        { value: "newest", label: getTranslate("rooms", "newestFirst") },
    ];

    const viewOptions = [
        { value: "grid", label: getTranslate("rooms", "grid"), icon: FaTh },
        { value: "list", label: getTranslate("rooms", "list"), icon: FaList },
    ];

    const handleFilterChange = (key, value) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    return (
        <div className="rooms-filters">
            <div className="rooms-filters__container">
                {/* View Mode */}
                <div className="rooms-filters__section">
                    <span className="rooms-filters__label">{getTranslate("rooms", "viewBy")}:</span>
                    <div className="rooms-filters__view-buttons">
                        {viewOptions.map(option => {
                            const Icon = option.icon;
                            return (
                                <button
                                    key={option.value}
                                    className={`rooms-filters__view-btn ${viewMode === option.value ? 'active' : ''}`}
                                    onClick={() => onViewModeChange(option.value)}
                                    title={option.label}
                                >
                                    <Icon />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Sort By */}
                <div className="rooms-filters__section">
                    <span className="rooms-filters__label">{getTranslate("rooms", "sortBy")}:</span>
                    <div className="rooms-filters__dropdown">
                        <button
                            className="rooms-filters__dropdown-btn"
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                        >
                            <span>{sortOptions.find(opt => opt.value === sortBy)?.label}</span>
                            <FaChevronDown className={`rooms-filters__dropdown-icon ${showSortDropdown ? 'open' : ''}`} />
                        </button>
                        {showSortDropdown && (
                            <div className="rooms-filters__dropdown-menu">
                                {sortOptions.map(option => (
                                    <button
                                        key={option.value}
                                        className={`rooms-filters__dropdown-item ${sortBy === option.value ? 'active' : ''}`}
                                        onClick={() => {
                                            onSortChange(option.value);
                                            setShowSortDropdown(false);
                                        }}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Filters Button */}
                <div className="rooms-filters__section">
                    <button
                        className={`rooms-filters__filter-btn ${showFiltersPanel ? 'active' : ''}`}
                        onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                    >
                        <FaFilter />
                        <span>{getTranslate("rooms", "filters")}</span>
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFiltersPanel && (
                <div className="rooms-filters__panel">
                    <div className="rooms-filters__panel-content">
                        {/* Price Range */}
                        <div className="rooms-filters__group">
                            <h4 className="rooms-filters__group-title">{getTranslate("rooms", "priceRange")}</h4>
                            <div className="rooms-filters__price-inputs">
                                <input
                                    type="number"
                                    placeholder={getTranslate("rooms", "min")}
                                    value={filters.priceMin || ''}
                                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                                    className="rooms-filters__input"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder={getTranslate("rooms", "max")}
                                    value={filters.priceMax || ''}
                                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                                    className="rooms-filters__input"
                                />
                            </div>
                        </div>

                        {/* Capacity */}
                        <div className="rooms-filters__group">
                            <h4 className="rooms-filters__group-title">{getTranslate("rooms", "capacity")}</h4>
                            <div className="rooms-filters__capacity">
                                <label className="rooms-filters__capacity-item">
                                    <span>{getTranslate("booking", "adults")}:</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={filters.adults || 1}
                                        onChange={(e) => handleFilterChange('adults', parseInt(e.target.value))}
                                        className="rooms-filters__input"
                                    />
                                </label>
                                <label className="rooms-filters__capacity-item">
                                    <span>{getTranslate("booking", "children")}:</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={filters.children || 0}
                                        onChange={(e) => handleFilterChange('children', parseInt(e.target.value))}
                                        className="rooms-filters__input"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Room Type */}
                        <div className="rooms-filters__group">
                            <h4 className="rooms-filters__group-title">{getTranslate("rooms", "roomSize")}</h4>
                            <div className="rooms-filters__capacity">
                                <label className="rooms-filters__capacity-item">
                                    <span>{getTranslate("rooms", "minAdults")}:</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={filters.minAdults || 1}
                                        onChange={(e) => handleFilterChange('minAdults', parseInt(e.target.value))}
                                        className="rooms-filters__input"
                                    />
                                </label>
                                <label className="rooms-filters__capacity-item">
                                    <span>{getTranslate("rooms", "minChildren")}:</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={filters.minChildren || 0}
                                        onChange={(e) => handleFilterChange('minChildren', parseInt(e.target.value))}
                                        className="rooms-filters__input"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Amenities (Icons) */}
                        <div className="rooms-filters__group">
                            <h4 className="rooms-filters__group-title">{getTranslate("rooms", "amenities")}</h4>
                            <div className="rooms-filters__checkboxes">
                                {[
                                    { key: 'wifi', label: getTranslate("rooms", "wifi") },
                                    { key: 'conditioner', label: getTranslate("rooms", "airConditioning") },
                                    { key: 'pool', label: getTranslate("rooms", "pool") },
                                    { key: 'gym', label: getTranslate("rooms", "gym") },
                                    { key: 'parking', label: getTranslate("rooms", "parking") },
                                    { key: 'shower', label: getTranslate("rooms", "shower") }
                                ].map(amenity => (
                                    <label key={amenity.key} className="rooms-filters__checkbox">
                                        <input
                                            type="checkbox"
                                            checked={filters.amenities?.includes(amenity.key) || false}
                                            onChange={(e) => {
                                                const amenities = filters.amenities || [];
                                                if (e.target.checked) {
                                                    handleFilterChange('amenities', [...amenities, amenity.key]);
                                                } else {
                                                    handleFilterChange('amenities', amenities.filter(a => a !== amenity.key));
                                                }
                                            }}
                                        />
                                        <span>{amenity.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="rooms-filters__actions">
                            <button
                                type="button"
                                className="rooms-filters__reset-btn"
                                onClick={() => {
                                    onResetFilters();
                                    setShowFiltersPanel(false);
                                }}
                            >
                                {getTranslate("rooms", "resetFilters")}
                            </button>
                            <button
                                type="button"
                                className="rooms-filters__apply-btn"
                                onClick={() => {
                                    onApplyFilters();
                                    setShowFiltersPanel(false);
                                }}
                            >
                                {getTranslate("rooms", "applyFilters")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomsFilters;
