import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
// import rootReducer from './reducers';
import counterReducer from '../features/counter/counterSlice';
import authenticationReducer from 'app/actions/authentication/authenticationSlice';
import { reducer as formReducer } from 'redux-form';

// const persistConfig = {
//   key: 'root',
//   version: 1,
//   storage,
//   // blacklist: ['form']
// }

// const persistedReducer = persistReducer(persistConfig, rootReducer)

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// })

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    authentication: authenticationReducer,
    form: formReducer
  },
});

// export let persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
