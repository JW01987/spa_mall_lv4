const express = require("express");
const app = express();
const port = 3000;
const commentRouter = require("./routes/comments");
const postRouter = require("./routes/posts");
const connect = require("./schemas");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const cookieParser = require("cookie-parser");
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api", [postRouter, commentRouter, usersRouter, authRouter]);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
