// import "./wdyr";

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./renderer/App";
import * as serviceWorker from "./serviceWorker";
import store from "./renderer/redux/stores/renderer";
import handleIpc from "./utils/handleIpc";
import isElectron from "./utils/electron/isElectron";
import createDataDirs from "./utils/files/createDataDirs";

if (isElectron()) {
  createDataDirs();
  handleIpc();
}



ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

if (module.hot && process.env.NODE_ENV === "development") {
  module.hot.accept();
  // eslint-disable-next-line global-require
  const NextApp = require("./renderer/App").default;
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <Router>
          <NextApp />
        </Router>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
