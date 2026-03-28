require("dotenv").config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');

const app = express();


// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session configuration
const sessionConfig = require('./config/session');
app.use(session(sessionConfig));

// route to the main directory for assets
app.use(express.static("assets"));


// ---------------- database ----------------------

// variable with which we import mysql2 into our project
const mysql = require("mysql2");

// variable DBCONFIG to store our credentials as defined in the .env file
const DBCONFIG = {
  host: "localhost",
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

// This code initialises a MySQL database connection by creating an instance of the connection using our earlier configuration (DBCONFIG). 
// We’ll use the resulting connection object to execute queries and interact with the MySQL database later on.
let connection = mysql.createConnection(DBCONFIG);

// we establish a connection with this code
connection.connect(onConnectionReady);

// callback function
function onConnectionReady(error) {
    if (error != null) {
        console.log(DBCONFIG);
        console.error('This Connection failed:', error);  // Log the error for debugging
    } else {
       console.log("This connection was successful."); // Log the success message
    }
}

// for registration
// variable for encrypting the password
const bcrypt = require('bcrypt');

// the form data from the registeration page is parsed and express is able to read it
app.use(express.urlencoded({ extended: true }));




// ── Routes ────────────────────────────────────────

// Homepage
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user || null });
});

// Auth routes
app.get('/auth/login', (req, res) => {
  res.render("login", { title: 'Sign In', error: null });
});

app.post('/auth/login', (req, res) => {
  // TODO: real login logic
  console.log("Successfully inside handler for POST new-user-session", req.body);

    connection.query(
        "SELECT * FROM tbl_users WHERE email = ?",
        [req.body.loginemail],
        async (dbErr, results) => {
            if (dbErr) {
                console.log(dbErr);
                return res.status(500).send("Database error");
            }

            // if no user is found, redirect to the login page
            if (results.length === 0) {
              return res.render("login", {
                error: "Invalid email or password"
              });
            }
            
            const user = results[0];

            // we compare the password typed into the login form with the hashed password in the database
            const match = await bcrypt.compare(req.body.loginpsw, user.password);

            // wrong password
            if (!match) {
              return res.render("login", {
                error: "Invalid email or password"
              });
            }

            // successful login
            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email
            };

            req.session.save((err) => {
                if (err) {
                    console.log("Session save error:", err);
                    return res.status(500).send("Session error");
                }

                res.redirect("/profile");
            });
        }
    );
});

  


app.get('/auth/register', (req, res) => {
  res.render('register', { title: 'Register', user: null });
});

app.post("/auth/register", async (req, res) => {
    console.log("newUser", req.body);

    /* password encryption */ 
    try {
        const { username, useremail, userphone, gender, psw } = req.body;

        // Basic validation
        if (!username || !useremail || !psw) {
            return res.status(400).send("Missing required fields");
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.psw, saltRounds);

        // store hashed password in the database
        connection.query(
            "INSERT INTO tbl_users(username, password, email, phonenumber, FIDgender) VALUES (?, ?, ?, ?, ?)",
            [
                req.body.username,
                hashedPassword, // store hashed password
                req.body.useremail,
                req.body.userphone,
                req.body.gender
            ],
        
            (dbErr, dbResults) => {
                if (dbErr) {
                    console.log("Database error:", dbErr);
                    // Handle the error, maybe render an error page or redirect back to registration
                    res.status(500).send("Error creating user");
                } else {
                    console.log("User created successfully:", dbResults);
                    // Render the 'register' page since there are no errors
                    res.redirect('/auth/login');
                }
            }
        );
    } catch (err) {
        console.error("Hashing error:", err);
        res.status(500).send("Server error");
    }
});

//  res.redirect('/auth/verify');


app.get('/auth/verify', (req, res) => {
  res.render('register-step2', { title: 'Verify', user: null });
});

app.post('/auth/verify', (req, res) => {
  // TODO: real verification logic
  res.redirect('/setup');
});

app.get('/auth/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Profile setup flow
app.get('/setup', (req, res) => {
  res.render('setup', { title: 'Profile Setup', user: req.session.user || null });
});

app.get('/setup/countries', (req, res) => {
  res.render('groups/profile/countries', { title: 'Countries Visited', user: req.session.user || null });
});

app.get('/setup/cities', (req, res) => {
  res.render('groups/profile/cities', { title: 'Cities Visited', user: req.session.user || null });
});

// Profile
app.get('/profile', (req, res) => {
  const user = req.session.user || {
    name: 'TestUser',
    username: 'TestUser',
    profile_image: null,
    avatar: null,
    countries_visited: 5,
    cities_visited: 12,
    groups_created: 3
  };
  res.render('profile', { user: user });
});

app.get('/profile/confirmed', (req, res) => {
  res.render('profile/confirmed', { user: req.session.user || null });
});

// Settings
app.get('/settings', (req, res) => {
  res.render('settings', { user: req.session.user || null });
});

// Group routes
app.use('/groups', require('./routes/groups'));

// Error handling - 404
app.use((req, res) => {
  res.status(404).render('error', {
    status: 404,
    message: 'Page not found',
    user: req.session.user || null
  });
});

// Error handling - 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    status: 500,
    message: 'Something went wrong',
    user: req.session.user || null
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;