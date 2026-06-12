import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from "./CalendarReducer/CalendarReducer.js";
import cartReducer from "./cartSlice.js";

export const store = configureStore({
    reducer: {
        calendar: calendarReducer,
        cart: cartReducer
    },
});
