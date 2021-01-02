require('dotenv').config()
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const path = require('path')

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


app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});



app.use("/pics", pics);
app.use("/users", users);
app.use("/email", email);
app.use("/comments", comments);
app.use("/family", family);
app.use("/requetes", requetes);
app.use(errorHandler);


const port = process.env.DB_PORT || 8000;

app.listen(port, () => {
  console.log("Server on" + port);
});
