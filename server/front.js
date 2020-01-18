const express = require('express');
const app = express();
const path = require('path');

app.get('/', function (req, res) {
  const buildPath = path.resolve(`${__dirname}/../web/build`);
  app.use(express.static(buildPath));
  res.sendFile(`${buildPath}/index.html`);
});
app.listen(9000);
