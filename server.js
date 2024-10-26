const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()
const mongoConnect = require('./mongodb');
const User = require('./models/user');
const session = require('express-session');


mongoConnect();

app.use(express.json());  // for JSON
app.use(express.urlencoded({ extended: true })); 
app.set('view engine', 'ejs')

app.use(session({
  secret: 'amit',  // Replace with a secure secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }   // Set secure: true if using HTTPS
}));



app.get('/', async (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.redirect('/home');
  } else {
    res.redirect('/login');
  }
})

app.get('/login', (req, res) => {
  res.render('login');
})


app.post('/logout', (req, res) => {
  // Destroy the session to log the user out
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }

    // Optionally, clear the cookie
    res.clearCookie('connect.sid');  // replace 'connect.sid' with your session cookie name if different
    res.status(200).send('Logged out');
  });
});

app.post('/login', async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ username: req.body.username, password: req.body.password });
    
    if (user) {
      req.session.user = { username: user.username };  // Store username in session
      console.log('User found:', user);
      res.redirect('/home');
    } else {
      
      console.log('User not found, creating a new one...');
      const newUser = new User({
        username: req.body.username,
        password: req.body.password
      });

      await newUser.save(); 
      req.session.user = { username: newUser.username }; // Save the new user
      console.log('New user saved:', newUser);
      res.redirect('/home');
    }
  } catch (error) {
    console.error('Error in /login route:', error);
    res.status(500).send('Server error');
  }
});


app.get('/home', async (req, res) => {

  if (req.session.user) {
    const username = req.session.user.username;  

    const shortUrls = await ShortUrl.find();
    
    res.render('index', { 
      username: username,  
      shortUrls: shortUrls 
    });
  } else {
    
    res.redirect('/login');
  }
})

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/home')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})

app.listen(5000, ()=>{
    console.log('Server started on port 5000');
});