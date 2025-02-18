// 리덕스 스토어 설정

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import bakeryReducer from './slices/bakerySlice';
import packageReducer from './slices/packageSlice';
import { persistStore } from 'redux-persist';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import reservationReducer from './slices/reservationSlice';
import reviewReducer from './slices/reviewSlice';
import echosaveReducer from './slices/echosaveSlice';
import addressReducer from './slices/addressSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    bakery: bakeryReducer,
    package: packageReducer,
    reservation: reservationReducer,
    review: reviewReducer,
    echosave: echosaveReducer,
    address: addressReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;