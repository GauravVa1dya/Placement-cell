const User = require("../models/userSchema");
const Student = require("../models/studentSchema");
const fs = require("fs");
const fastcsv = require("fast-csv");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFile);

// render sign up page
module.exports.signup = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("back");
  }
  res.render("signup");
};

// render sign in page
module.exports.signin = function (req, res) {
  if (req.isAuthenticated()) {
    req.flash("error", "Error occurred during signin");
    return res.redirect("back");
  }
  res.render("signin");
};

// create session
module.exports.createSession = function (req, res) {
  req.flash("success", "Session created. Logged in successfully!");
  console.log("Session created successfully");
  return res.redirect("/");
};

// signout
module.exports.signout = function (req, res) {
  req.logout(function (err) {
    if (err) {
      req.flash("error", "Error occurred during signout");
      return next(err);
    } else {
      req.flash("success", "You have been signed out successfully!");
      return res.redirect("/users/signin");
    }
  });
};

// create user
module.exports.createUser = async function (req, res) {
  const { name, email, password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match");
      return res.redirect("back");
    }
    const user = await User.findOne({ email });

    if (user) {
      req.flash("error", "Email already exists!");
      return res.redirect("back");
    }

    const newUser = await User.create({
      name,
      email,
      password,
    });

    await newUser.save();

    if (!newUser) {
      console.log(`Error in creating user`);
      return res.redirect("back");
    }
    req.flash("success", "You have been successfully signed up");
    return res.redirect("/users/signin");
  } catch (error) {
    console.log(`Error in creating user: ${error}`);
    res.redirect("back");
  }
};

// download report
module.exports.downloadCsv = async function (req, res) {
  try {
    const students = await Student.find({});

    let data = "";
    let no = 1;
    let csv =
      "S.No, Name, Email, College, Placemnt, Contact Number, Batch, DSA Score, WebDev Score, React Score, Interview, Date, Result";

    for (let student of students) {
      data =
        no +
        "," +
        student.name +
        "," +
        student.email +
        "," +
        student.college +
        "," +
        student.placement +
        "," +
        student.contactNumber +
        "," +
        student.batch +
        "," +
        student.dsa +
        "," +
        student.webd +
        "," +
        student.react;

      if (student.interviews.length > 0) {
        for (let interview of student.interviews) {
          data +=
            "," +
            interview.company +
            "," +
            interview.date.toString() +
            "," +
            interview.result;
        }
      }
      no++;
      csv += "\n" + data;
    }

    await writeFileAsync("report/data.csv", csv);

    req.flash("success", "Report generated successfully!"); // Flash message generated before sending the file
    setTimeout(() => {
      res.download("report/data.csv"); // Send the file for download
    }, 1000);
  } catch (error) {
    console.log(`Error in downloading file: ${error}`);
    req.flash("error", "Problem occurred in generating report.");
    return res.redirect("back");
  }
};
