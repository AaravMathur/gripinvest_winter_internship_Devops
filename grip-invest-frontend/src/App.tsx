import React from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "./routes";
import "./index.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};

export default App;
