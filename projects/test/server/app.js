'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

//------------------------------------
// Client handling
//------------------------------------

app.use(express.static(path.join(__dirname, '../client')));

app.get('*', function (request, response) {
  response.sendFile(path.join(__dirname, '../client'));

});


//------------------------------------
// 404 handling
//------------------------------------

app.use((req, res) => {
  res.status(404).send('Not Found');
});



//------------------------------------
// start server
//------------------------------------

if (module === require.main) {
  const server = app.listen(80, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;