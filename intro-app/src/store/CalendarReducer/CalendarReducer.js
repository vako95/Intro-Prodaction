import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    rooms: { count: 1, label: "Room" },
    adults: { count: 1, label: "Adult" },
    children: { count: 0, label: "Child" },
};

export const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        setCount: (state, action) => {
            const { key, count } = action.payload;
            if (state[key]) state[key].count = count;
        },
        setAll: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setCount, setAll } = calendarSlice.actions;
export default calendarSlice.reducer;
