const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
dotenv.config();
const port = 3000;

//configration

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/Public"));
app.set("Views", path.join(__dirname, "Views"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.JWT_SCERET_KEY));
app.use(
  session({
    secret: process.env.JWT_SCERET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

//calling routers

const signup_router = require("./Controllers/signup_controller");
const loginRouter = require("./Controllers/login_controller");
const { verifyToken } = require("./middlerwares/auth");

app.use(signup_router);
app.use(loginRouter);

app.get("/", (req, res) => {
  res.render("start_page.ejs");
});

app.get("/payment_method", (req, res) => {
  res.render("payment_method.ejs");
});


app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

app.get('/card', (req, res) => {
  res.render('card.ejs')
})
app.get('/index', verifyToken,  (req, res) => {
  res.render('index.ejs')
})

app.get('/pages/games', (req, res) => {
  res.render('games.ejs')
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`));