const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({
  secret: 'supersecretkey123',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.use(express.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const USERNAME = 'admin';
  const PASSWORD = 'denr2025';

  if (username === USERNAME && password === PASSWORD) {
    req.session.loggedIn = true;
    res.redirect('/');
  } else {
    res.send('Invalid username or password. <a href="/login">Try again</a>');
  }
});

function authMiddleware(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}

app.get('/', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'queue.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.listen(PORT, () => {
  console.log(`Server running sa port ${PORT}`);
});
