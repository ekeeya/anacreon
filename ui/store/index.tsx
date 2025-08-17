"use client";

import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import React from "react";

// UI slice for settings state (active tab, modals, etc.)
interface UiState {
  settingsTab: string;
}

const initialUi: UiState = { settingsTab: "general" };

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUi,
  reducers: {
    setSettingsTab(state, action: PayloadAction<string>) {
      state.settingsTab = action.payload;
    },
  },
});

export const { setSettingsTab } = uiSlice.actions;

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}


