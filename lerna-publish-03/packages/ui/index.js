import React from "react";
import { greet } from "@monorepo/shared";

function App() {
  return <h1>{greet("Frontend")}</h1>;
}

export default App;