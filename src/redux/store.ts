import { configureStore } from "@reduxjs/toolkit";

import quickViewReducer from "./features/quickView-slice";
import cartReducer from "./features/cart-slice";
import wishlistReducer from "./features/wishlist-slice";
import productDetailsReducer from "./features/product-details";

import { TypedUseSelectorHook, useSelector } from "react-redux";

// NEW
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// persist config khusus cart
const cartPersistConfig = {
  key: "cart",
  storage,
};
// persist config wishlist
const wishlistPersistConfig = {
  key: "wishlist",
  storage,
};


// wrap cart reducer
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
// wrap wishlist reducer
const persistedWishlistReducer = persistReducer(
  wishlistPersistConfig,
  wishlistReducer
);

export const store = configureStore({
  reducer: {
    quickViewReducer,
    cartReducer: persistedCartReducer, // ← ganti ini
    wishlistReducer: persistedWishlistReducer, // ← tambahin ini
    productDetailsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// NEW
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;