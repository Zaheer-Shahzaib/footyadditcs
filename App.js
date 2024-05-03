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
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

//calling routers

const signup_router = require("./Controllers/signup_controller");
const loginRouter = require("./Controllers/login_controller");
const { verifyToken } = require("./middlerwares/auth");
const booking_route = require("./Controllers/booking_controller");
const router = require("./Controllers/logout_controller");
const gamesRouter = require("./Controllers/Games");
//routes
app.use(signup_router);
app.use(loginRouter);
app.use(booking_route)
app.use(gamesRouter)
app.get("/", (req, res) => {
  // Check for existing session and logged-in state
  if (req.session && req.session.isLoggedIn) {
    console.log("Session exists, redirecting to main page");
    return res.redirect("/main_page"); // Use return to avoid further execution
  } 
  // If no session or not logged in, redirect to login page
  console.log("Session not found or user not logged in, redirecting to login");
  res.redirect("/login");
});

app.get("/payment_method", (req, res) => {
  res.render("payment_method.ejs");
});


app.get(router, (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

app.get('/card', (req, res) => {
  res.render('card.ejs')
})
app.get('/main_page', verifyToken, (req, res) => {
  res.render('index.ejs')
})

app.get('/admin-login', (req, res) => {
  res.render('adminLogin.ejs')
})
app.get("/edit-profile", verifyToken, (req, res) => {
  res.render("editProfile.ejs");
});
app.get("/upcoming-bookings", verifyToken, (req, res) => {
  res.render("upcomingBooking.ejs");
});
app.get("/sports-facilities", verifyToken, (req, res) => {
  res.render("addSportsFacility.ejs");
});
app.get("/make-payment", (req, res) => {
  res.render("makePayment.ejs");
});
app.get("/booking-success", verifyToken, (req, res) => {
  res.render("confirmBooking.ejs");
});
app.get("/booking-cancel", verifyToken,(req, res) => {
  res.render("bookingCancel.ejs");
});
app.get("/reschedule", verifyToken, (req, res) => {
  res.render("reschedule.ejs");
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
