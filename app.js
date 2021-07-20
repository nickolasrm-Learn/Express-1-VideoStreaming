//Importing modules
const express = require('express'),
      path = require('path')
//Importing routers
const indexRouter = require('./routes/index'),
      videoRouter = require('./routes/video')
//Instantiating express
const app = express()
//Defining constants
const port = 3000

//app.use tells express a middleware is going to be defined
//A middleware is a function added to the express pipeline
//This tells express there is a static files directory that can be accessed by client
//It is good for storing public images, like a logo of a website
app.use(express.static('public'))

//Tells express to use our routers
//Routers are a collections of routers
//A route is a url path where a user can send requests
app.use(indexRouter)
app.use(videoRouter)

//Setting express view engine
//A view engine is a middleware used by express to process front-end files
//In this case I'm using an "html" engine, but a view engine is suited to be used
//as a template builder (similar to PHP). 
//Check out my resume builder where I use a lot of ejs and templates:
//https://github.com/nickolasrm/ResumeBuilder
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//Tells express which port it should be accepting requests
module.exports = app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})