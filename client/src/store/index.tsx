import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logged_userSlice, { LoggedUserState } from './slices/logged_userSlice';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: CONFIG.appName,
  storage,
};

const rootReducer = combineReducers({
  logged_user: logged_userSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = {
  logged_user: LoggedUserState;
};
export type AppDispatch = typeof store.dispatch;
