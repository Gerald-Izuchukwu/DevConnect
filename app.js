const express = require('express');
const connectDB = require('./config/db');
const usersRoute = require('./routes/api/users');
const authRoute = require('./routes/api/auth');
const profileRoute = require('./routes/api/profile');
const postRoute = require('./routes/api/posts');
const PORT = process.env.PORT || 5000;

const app = express();

// connect dataBase
connectDB();

// body middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.send('hello and welcome to this app! :)');
});

app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.use('/api/profile', profileRoute);
app.use('/api/posts', postRoute);

app.listen(PORT, () => {
  console.log(`Server Started on Port ${PORT}`);
});
