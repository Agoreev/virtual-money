const express = require("express");
var favicon = require("serve-favicon");
const path = require("path");
const port = process.env.PORT || 8080;

const app = express();

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "build")));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(port);
