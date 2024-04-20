const express = require("express");
const dotenv = require("dotenv");
const db = require("./config/mongoose");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passportLocal = require("./config/passport-local-startegy");
const customMware = require("./config/middleware");
const port = process.env.PORT || 8000;

dotenv.config({ path: "config/.env" });

const app = express();
// set ejs as view engine
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(cookieParser("NotSoSecret"));
app.use(
  session({
    //change the secrate before deployment in production mode
    secret: "hello", // SECRET is stored in the system veriable
    //if the session data is alredy stored we dont need to rewrite it again and again so this is set to false
    resave: true,
    //when the user is not logged in or identity is not establish in that case we dont need to save extra data in
    //session cookie so this is set to false
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 100 },
  })
);

//extract styles and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(customMware.setFlash);

// app.get("/test", function (req, res) {
//   req.flash("success_msg", "This is a test success message");
//   req.flash("error_msg", "This is a test error message");
//   res.redirect("/"); // Redirect to a route where flash messages are displayed
// });

//for static file use
app.use(express.static("./assets"));

// for authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// express router
app.use("/", require("./routes"));

// listen on port
app.listen(port, function (error) {
  if (error) {
    console.log(`Error in connecting to server: ${error}`);
    return;
  }
  console.log(`Server running on port: ${port}`);
});
