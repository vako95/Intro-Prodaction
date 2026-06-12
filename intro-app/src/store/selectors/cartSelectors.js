import { createSelector } from '@reduxjs/toolkit';

const selectCartState = (state) => state.cart;

export const selectCartItems = createSelector(
    [selectCartState],
    (cart) => cart.items
);

export const selectCartTotalItems = createSelector(
    [selectCartState],
    (cart) => cart.total_items
);

export const selectCartTotalPrice = createSelector(
    [selectCartState],
    (cart) => cart.total_price
);

export const selectCartLoading = createSelector(
    [selectCartState],
    (cart) => cart.loading
);

export const selectCartItemsAndPrice = createSelector(
    [selectCartItems, selectCartTotalPrice],
    (items, total_price) => ({ items, total_price })
);

export const selectCartItemsAndTotal = createSelector(
    [selectCartItems, selectCartTotalItems],
    (items, total_items) => ({ items, total_items })
);

export const selectCartFullData = createSelector(
    [selectCartItems, selectCartTotalPrice, selectCartLoading],
    (items, total_price, loading) => ({ items, total_price, loading })
);
