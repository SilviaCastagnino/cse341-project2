const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database.js');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-key'
  );
  res.setHeader('Access-Control-Allow-Headers', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});
app.use('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.log('Failed to connect to database');
  } else {
    app.listen(PORT, () => {
      console.log(`Database is listening and node is running on port ${PORT}`)
    });
  }
});