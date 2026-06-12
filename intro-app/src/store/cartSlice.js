import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CartApi } from "../api/modules/cart";

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const data = await CartApi.getCart();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addToCartAsync = createAsyncThunk(
    'cart/addToCart',
    async (cartData, { rejectWithValue }) => {
        try {
            const data = await CartApi.addToCart(cartData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateCartItemAsync = createAsyncThunk(
    'cart/updateCartItem',
    async ({ itemId, updates }, { rejectWithValue }) => {
        try {
            const data = await CartApi.updateCartItem(itemId, updates);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const removeFromCartAsync = createAsyncThunk(
    'cart/removeFromCart',
    async (itemId, { rejectWithValue }) => {
        try {
            await CartApi.removeFromCart(itemId);
            return itemId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const clearCartAsync = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            await CartApi.clearCart();
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    items: [],
    total_items: 0,
    total_price: 0,
    isModalOpen: false,
    loading: false,
    error: null
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        openCartModal: (state) => {
            state.isModalOpen = true;
        },
        closeCartModal: (state) => {
            state.isModalOpen = false;
        },
        updateCartItemLocal: (state, action) => {
            const { id, updates } = action.payload;
            const item = state.items.find(i => i.id === id);
            if (item) {
                Object.assign(item, updates);
                if (item.room_price && item.nights) {
                    item.subtotal = item.room_price * item.nights * item.rooms_count;
                }
            }
            state.total_price = state.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items || [];
                state.total_items = action.payload.total_items || 0;
                state.total_price = action.payload.total_price || 0;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            .addCase(addToCartAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.isModalOpen = true;
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            .addCase(updateCartItemAsync.fulfilled, (state, action) => {
                const updatedItem = action.payload;
                const index = state.items.findIndex(i => i.id === updatedItem.id);
                if (index !== -1) {
                    state.items[index] = updatedItem;
                }
                state.total_price = state.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
            })
            
            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
                state.total_items = state.items.length;
                state.total_price = state.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
            })
            
            .addCase(clearCartAsync.fulfilled, (state) => {
                state.items = [];
                state.total_items = 0;
                state.total_price = 0;
            });
    }
});

export const {
    openCartModal,
    closeCartModal,
    updateCartItemLocal
} = cartSlice.actions;

export default cartSlice.reducer;
