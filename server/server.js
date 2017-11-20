const path = require('path')
const express = require('express')

// set public path -- path is built into node to flatten directories/paths
const publicPath = path.join(__dirname, '..', '/public');

// set port -- should be done in config file
const port = process.env.PORT || 3000;

// create server
let app = express();

// middleware to tell express to use this static directory
app.use(express.static(publicPath));

// route for base url
// dont technically have to use this since it will default to index.html
app.get('/', (req, res) => {
  res.render('index');
});

// have app listen for requests
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
})
