const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = 3000;

// Palitan ito kung gusto mo ng ibang username/password
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'denr2025';

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'denr-super-secret',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

function authMiddleware(req, res, next) {
  if (req.session.loggedIn) next();
  else res.redirect('/login');
}

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.loggedIn = true;
    res.redirect('/dashboard');
  } else {
    res.send('Maling username o password. <a href="/login">Subukan ulit</a>.');
  }
});

app.get('/dashboard', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/queue.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.listen(PORT, () => {
  console.log(`Server running sa http://localhost:${PORT}`);
});
