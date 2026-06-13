import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// Import slices
import authReducer from './slices/authSlice';
import manufacturerReducer from './slices/manufacturerSlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import notificationReducer from './slices/notificationSlice';

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  manufacturer: manufacturerReducer,
  product: productReducer,
  order: orderReducer,
  notification: notificationReducer,
});

// Persist configuration
const persistConfig = {
  key: 'skaarvi-manufacturer-root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
