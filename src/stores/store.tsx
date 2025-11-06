import { combineReducers, configureStore } from '@reduxjs/toolkit';
import locationReducer from '../slices/locationSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONSTANTS } from '../config/constants';

const persistConfig = {
    key: APP_CONSTANTS.STORAGE_KEYS.LOCATIONS, // Key for the storage
    storage: AsyncStorage, // Storage engine to use
};

// 2. Combine your reducers (if you have multiple)
const rootReducer = combineReducers({
    locations: locationReducer
});


// 3. Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);


// 4. Configure the Redux store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // use redux-persist constants rather than raw strings so they always match
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                // redux-persist puts non-serializable functions on the `register` field of the action
                // ignore that path so the middleware doesn't warn about it
                ignoredActionPaths: ['register'],
            },
        }),
});

// 5. Create the persistor
export const persistor = persistStore(store);

// Export types for use throughout the app (hooks, selectors, etc.)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

