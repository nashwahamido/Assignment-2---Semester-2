import React from "react";
import { createRoot } from "react-dom/client";
import Activities from "./src/components/activities";

var mount = document.getElementById("activities-root");

if (mount) {
  createRoot(mount).render(<Activities />);
}