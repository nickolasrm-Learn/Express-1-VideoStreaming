const express = require('express');
//Instantiating an express router
const router = express.Router();

//Defining the / route with the GET method
//Learn more about HTTP requests here:
//https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
router.get('/', function(req, res, next) {
  //Rendering the /views/index.html file using a view engine
  res.render('index');
});

module.exports = router;
