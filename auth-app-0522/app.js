require("dotenv/config");

require("./db");

const express = require("express");
const app = express();

require("./config/session.config")(app)         // session setup
require("./config")(app);

app.locals.appTitle = `Auth app`;

const index = require("./routes/index.routes");
app.use("/", index);

require("./error-handling")(app);

module.exports = app;
