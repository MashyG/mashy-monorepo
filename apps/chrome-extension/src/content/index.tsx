import React from "react";
import ReactDOM from "react-dom/client";
import ContentMain from "./main.tsx";

function injectContent() {
  const root = document.createElement("div");
  root.id = "mashy-extension";
  document.body.appendChild(root);

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ContentMain />
    </React.StrictMode>
  );
}

injectContent();
