import { configureStore } from '@reduxjs/toolkit';
import { mindReducer } from './MindReducer';
import { mindOverviewReducer } from './MindOverviewReducer';
import { userReucer } from './UserReucer';
// ...

export const store = configureStore({
  reducer: {
    mind:mindReducer,
    mindOverview:mindOverviewReducer,
    user:userReucer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;