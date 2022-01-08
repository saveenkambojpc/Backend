const connectToMongo = require("./db");
var express = require("express");

connectToMongo();

const app = express();
const port = 3000;

// Middleware for using req json in console in auth.js
app.use(express.json());

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
