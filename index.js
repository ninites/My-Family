require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const path = require("path");
const port = process.env.PORT || 8000;

const pics = require("./routes/pics");
const users = require("./routes/users");
const email = require("./routes/email");
const comments = require("./routes/comments");
const family = require("./routes/family");
const requetes = require("./routes/requetes");
const errorHandler = require("./error/errorHandler");

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/pics", pics);
app.use("/users", users);
app.use("/email", email);
app.use("/comments", comments);
app.use("/family", family);
app.use("/requetes", requetes);
app.use(errorHandler);

app.use("/myfamily/", express.static(path.resolve(__dirname, "./public/build")));

app.get("/myfamily/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "build", "index.html"));
});


app.listen(port, () => {
  console.log("Server on" + port);
});
