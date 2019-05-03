const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 8000

app.use(express.static(path.join(__dirname, 'src')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(port, () => {
  console.log('App listening on http://localhost:%s', port)
});