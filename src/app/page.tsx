"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import VoiceList from "./voice-list";

export default function Home() {
  return (
    <Provider store={store}>
      <VoiceList/>
    </Provider>
  );
}
