import { configureStore } from '@reduxjs/toolkit';

import { licensingReducer } from '@/entities/licensing';
import { sessionReducer } from '@/entities/session';
import { filterReducer } from '@/features/licensing-filter';
import { requestsReducer } from '@/shared/model';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    licensing: licensingReducer,
    filter: filterReducer,
    requests: requestsReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
