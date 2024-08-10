// store/store.ts
import voiceReducer from '@/components/voices.slice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    voice: voiceReducer
  },
});

// Tipos inferidos para RootState e AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
