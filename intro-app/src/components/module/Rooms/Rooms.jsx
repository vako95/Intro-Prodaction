import { Container, Pagination } from "@components/ui";
import { DecoratedHeading } from "@components/ui";
import { useState, useMemo } from "react";

import SectionWrapper from "../../ui/SectionWrapper/SectionWrapper";
import RoomsItem from "./components/RoomsItem/RoomsItem.jsx";
import RoomsFilters from "./components/RoomsFilters/RoomsFilters.jsx";
import { useRoomsQuery } from "../../../hooks/useRooms";
import { Manager } from "../../../state/index.js";
import { useLang } from "@hooks/useLang";
import "./Rooms.css";

import RoomsList from "./components/RoomsList/RoomsList.jsx";



const Rooms = ({ showFilters = false, limit = null }) => {
    const { getTranslate } = useLang();

    const { data: rooms, isLoading, isError } = useRoomsQuery(limit ? { limit } : {});
    
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('recommended');
    const [currentPage, setCurrentPage] = useState(1);
    const roomsPerPage = 6;
    const [filters, setFilters] = useState({
        priceMin: '',
        priceMax: '',
        adults: 1,
        children: 0,
        minAdults: 1,
        minChildren: 0,
        amenities: [],
    });
    const [appliedFilters, setAppliedFilters] = useState(filters);

    const filteredAndSortedRooms = useMemo(() => {
        if (!rooms) return [];

        let result = [...rooms];

        if (showFilters) {
            result = result.filter(room => {
                if (appliedFilters.priceMin && room.final_price < parseFloat(appliedFilters.priceMin)) {
                    return false;
                }
                if (appliedFilters.priceMax && room.final_price > parseFloat(appliedFilters.priceMax)) {
                    return false;
                }

                if (appliedFilters.minAdults && room.capacity_adult < appliedFilters.minAdults) {
                    return false;
                }
                if (appliedFilters.minChildren && room.capacity_children < appliedFilters.minChildren) {
                    return false;
                }

                const totalGuests = appliedFilters.adults + appliedFilters.children;
                if (room.capacity_total < totalGuests) {
                    return false;
                }

                if (appliedFilters.amenities && appliedFilters.amenities.length > 0) {
                    const roomIcons = room.icons || [];
                    const hasAllAmenities = appliedFilters.amenities.every(amenity =>
                        roomIcons.includes(amenity)
                    );
                    if (!hasAllAmenities) {
                        return false;
                    }
                }

                return true;
            });
        }

        if (showFilters) {
            switch (sortBy) {
                case 'price_low':
                    result.sort((a, b) => a.final_price - b.final_price);
                    break;
                case 'price_high':
                    result.sort((a, b) => b.final_price - a.final_price);
                    break;
                case 'rating':
                    result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                    break;
                case 'newest':
                    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    break;
                case 'recommended':
                default:
               
                    break;
            }
        }

        return result;
    }, [rooms, appliedFilters, sortBy, showFilters]);

    const handleApplyFilters = () => {
        setAppliedFilters(filters);
        setCurrentPage(1); // Сбрасываем на первую страницу при применении фильтров
    };

    const handleResetFilters = () => {
        const resetFilters = {
            priceMin: '',
            priceMax: '',
            adults: 1,
            children: 0,
            minAdults: 1,
            minChildren: 0,
            amenities: [],
        };
        setFilters(resetFilters);
        setAppliedFilters(resetFilters);
        setCurrentPage(1); 
    };

    const totalPages = Math.ceil(filteredAndSortedRooms.length / roomsPerPage);
    const startIndex = (currentPage - 1) * roomsPerPage;
    const endIndex = startIndex + roomsPerPage;
    const currentRooms = filteredAndSortedRooms.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        document.querySelector('.rooms')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <SectionWrapper bgColor="midnightVelvet">
            <Container>
                <div className="rooms">
                    <div className="rooms__heading">
                        <DecoratedHeading
                            title={getTranslate("rooms", "title")}
                            subtitle={getTranslate("rooms", "allRooms")}
                        />
                    </div>

                    {showFilters && (
                        <RoomsFilters
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            filters={filters}
                            onFiltersChange={setFilters}
                            onApplyFilters={handleApplyFilters}
                            onResetFilters={handleResetFilters}
                        />
                    )}

                    <Manager
                        className="rooms__unavailable"
                        isLoading={isLoading}
                        isError={isError}
                        skeletonProps={{
                            id: "swap-skeleton",
                            as: "div",
                            count: 4,
                        }}
                        unavailableProps={{
                            title: getTranslate("messages", "error"),
                            description: getTranslate("errors", "failedToLoad"),
                        }}
                        emptyProps={{
                            title: getTranslate("rooms", "noRoomsFound"),
                            description: getTranslate("rooms", "clearFilters"),
                        }}
                        renderWrapper={(props) => (
                            <RoomsList {...props} viewMode={showFilters ? viewMode : 'grid'} />
                        )}
                        skeletonWrapper={RoomsList}
                        items={currentRooms}
                        renderMap={
                            (item) => (
                                <RoomsItem
                                    key={item.id}
                                    item={item}
                                    viewMode={showFilters ? viewMode : 'grid'}
                                />
                            )} />

                    {totalPages > 1 && (
                        <div className="rooms__pagination">
                            <Pagination
                                page={currentPage}
                                total={totalPages}
                                siblings={1}
                                boundaries={1}
                                onChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </Container>
        </SectionWrapper>
    );
};

export default Rooms;
