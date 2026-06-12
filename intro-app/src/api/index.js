export { publicApiClient, privateApiClient } from "./client.js";

export { loginAPI } from "./auth/login.js";
export { registerAPI } from "./auth/register.js";
export { logoutAPI } from "./auth/logout.js";
export { refreshAPI } from "./auth/refresh.js";
export { passwordAPI } from "./auth/password.js";

export { profileAPI } from "./modules/profile.js";
export { SliderHeroAPI as heroSliderAPI } from "./modules/hero_slider.js";
export { ServiceApi as serviceAPI } from "./modules/service.js";
export { SwapAPI as swapAPI } from "./modules/swap.js";
export { AdvantagesBarAPI as advantagesBarAPI } from "./modules/advantages_bar.js";
export { FoodAPI as foodAPI } from "./modules/food.js";
export { RoomsApi as roomsAPI } from "./modules/rooms.js";
export { PersonalAPI as personalAPI } from "./modules/personal.js";
export { NewsAPI as newsAPI } from "./modules/news.js";
export { NewsFeedAPI as newsFeedAPI } from "./modules/news_feed.js";
export { QuoteApi } from "./modules/quote.js";
export { WishlistApi as wishlistAPI } from "./modules/wishlist.js";

export { API } from "./unified.js";
export {
    useAuth,
    useProfile,
    useOrders,
    useHeroSlider,
    useService,
    useSwap,
    useAdvantagesBar,
    useFood,
    useRooms,
    useRoomById,
    usePersonal,
    useNews,
    useNewsFeed
} from "../hooks/useAPI.js";

export { useBooking } from "../hooks/useBooking.js";
