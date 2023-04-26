const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const Port = 2023;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload =require("express-fileupload")


const userRouter = require("./src/router/router");
server.listen(
  Port,
  console.log(`server is listening to the  http://localhost:${Port}`)
);

app.get("/", (req, res) => {
  res.send("connected to backend");
});
mongoose.connect(
  "mongodb+srv://sougata2023:Sougata123@sougata2023.xxtcgd4.mongodb.net/nodeBack"
);
mongoose.connection.on("connected", (connected) => {
  console.log("connected to database");
});
mongoose.connection.on("error", (error) => {
  console.log("failed to connect with data base");
});

app.use(fileUpload({
  useTempFiles:true
}))
app.use(cors({ extende: true, credentials: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api/v1", userRouter);
