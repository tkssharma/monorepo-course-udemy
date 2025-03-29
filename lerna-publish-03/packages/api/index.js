const express = require("express");
const { greet } = require("@monorepo/shared");

const app = express();

app.get("/", (req, res) => {
  res.send(greet("Backend"));
});

app.listen(3000, () => console.log("Backend running on port 3000"));