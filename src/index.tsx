// import React from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App.tsx";
// import "./index.css";

// const container = document.getElementById("root");
// const root = createRoot(container!);
// root.render(<App />);
import React from "react";
import * as ReactDOMClient from "react-dom/client";

import App from "./App.tsx";
import "./index.scss";

function render(props) {
  const container = document.getElementById("root") as HTMLElement;
  // Concurrent mode
  const root = ReactDOMClient.createRoot(container);
  root.render(<App {...props} />);
  // requestIdleCallback(callback);
}

render({});
