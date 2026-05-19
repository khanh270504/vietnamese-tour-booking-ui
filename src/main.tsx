import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './app/redux/store'; // Sửa path cho đúng với file store của sếp

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);