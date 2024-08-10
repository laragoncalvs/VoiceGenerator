"use client";

import { Provider } from "react-redux";
import VoiceList from "./voice.list";
import { store } from "./store";

export default function Home() {
  return (
    <Provider store={store}>
      <VoiceList/>
    </Provider>
  );
}
